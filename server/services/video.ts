import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { db } from "../db";
import { videoProjects } from "@shared/schema";
import { eq } from "drizzle-orm";

const UPLOADS_DIR = path.join(process.cwd(), "uploads", "videos");

export function getProjectDir(projectId: number): string {
  return path.join(UPLOADS_DIR, String(projectId));
}

export function getEditDir(projectId: number): string {
  return path.join(getProjectDir(projectId), "edit");
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function runPython(script: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", [script, ...args], {
      env: { ...process.env },
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Python exited ${code}: ${stderr.slice(0, 500)}`));
    });
  });
}

async function setStatus(
  projectId: number,
  status: string,
  extra: Partial<{ errorMessage: string; processedVideoPath: string; transcriptPath: string; edlPath: string; metadata: object }> = {}
) {
  await db
    .update(videoProjects)
    .set({ status, updatedAt: new Date(), ...extra })
    .where(eq(videoProjects.id, projectId));
}

export async function runTranscription(projectId: number): Promise<void> {
  const [project] = await db.select().from(videoProjects).where(eq(videoProjects.id, projectId));
  if (!project?.originalVideoPath) throw new Error("No video path on project");

  const editDir = getEditDir(projectId);
  ensureDir(editDir);

  await setStatus(projectId, "transcribing");

  try {
    const script = path.join(process.cwd(), "video-pipeline", "helpers", "transcribe.py");
    await runPython(script, [
      project.originalVideoPath,
      "--edit-dir", editDir,
    ]);

    const videoName = path.basename(project.originalVideoPath, path.extname(project.originalVideoPath));
    const transcriptPath = path.join(editDir, "transcripts", `${videoName}.json`);

    // Also pack the transcript
    const packScript = path.join(process.cwd(), "video-pipeline", "helpers", "pack_transcripts.py");
    await runPython(packScript, ["--edit-dir", editDir]);

    await setStatus(projectId, "transcribed", { transcriptPath });
  } catch (err: any) {
    await setStatus(projectId, "error", { errorMessage: err.message });
    throw err;
  }
}

export async function runFillerRemoval(
  projectId: number,
  config: { fillers?: string[]; minSilence?: number; grade?: string; subtitles?: boolean }
): Promise<void> {
  const [project] = await db.select().from(videoProjects).where(eq(videoProjects.id, projectId));
  if (!project?.transcriptPath) throw new Error("No transcript — run transcription first");

  const editDir = getEditDir(projectId);
  const edlPath = path.join(editDir, "edl.json");

  await setStatus(projectId, "editing");

  try {
    // Step 1: Generate EDL from transcript
    const fillerScript = path.join(process.cwd(), "video-pipeline", "helpers", "filler_remove.py");
    const fillerArgs = [
      project.transcriptPath,
      "--output", edlPath,
      "--min-silence", String(config.minSilence ?? 0.3),
    ];
    if (config.fillers?.length) {
      fillerArgs.push("--extra-fillers", config.fillers.join(","));
    }
    await runPython(fillerScript, fillerArgs);

    await setStatus(projectId, "rendering", { edlPath });

    // Step 2: Render the EDL
    const renderScript = path.join(process.cwd(), "video-pipeline", "helpers", "render.py");
    await runPython(renderScript, [
      edlPath,
      "--video", project.originalVideoPath!,
      "--edit-dir", editDir,
      "--quality", "preview",
    ]);

    const finalPath = path.join(editDir, "final.mp4");

    await setStatus(projectId, "done", { processedVideoPath: finalPath });
  } catch (err: any) {
    await setStatus(projectId, "error", { errorMessage: err.message });
    throw err;
  }
}

export async function getPackedTranscript(projectId: number): Promise<string | null> {
  const editDir = getEditDir(projectId);
  const packedPath = path.join(editDir, "takes_packed.md");
  if (!fs.existsSync(packedPath)) return null;
  return fs.readFileSync(packedPath, "utf-8");
}

export { ensureDir, UPLOADS_DIR };
