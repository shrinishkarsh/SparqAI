import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Film,
  Mic,
  Scissors,
  Sparkles,
  Download,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  FileVideo,
} from "lucide-react";

interface VideoProject {
  id: number;
  name: string;
  status: string;
  originalVideoPath?: string;
  processedVideoPath?: string;
  transcriptPath?: string;
  editConfig?: Record<string, unknown>;
  motionGraphicsConfig?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; progress: number }> = {
  pending:          { label: "Uploaded",       color: "bg-gray-100 text-gray-700",   progress: 10 },
  transcribing:     { label: "Transcribing…",  color: "bg-blue-100 text-blue-700",   progress: 35 },
  transcribed:      { label: "Transcribed",    color: "bg-blue-100 text-blue-700",   progress: 45 },
  editing:          { label: "Removing fillers…", color: "bg-yellow-100 text-yellow-700", progress: 65 },
  rendering:        { label: "Rendering…",     color: "bg-orange-100 text-orange-700", progress: 80 },
  adding_graphics:  { label: "Adding graphics…", color: "bg-purple-100 text-purple-700", progress: 90 },
  done:             { label: "Done",           color: "bg-green-100 text-green-700", progress: 100 },
  error:            { label: "Error",          color: "bg-red-100 text-red-700",     progress: 0 },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      {status === "transcribing" || status === "editing" || status === "rendering" || status === "adding_graphics" ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : status === "done" ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : status === "error" ? (
        <XCircle className="w-3 h-3" />
      ) : null}
      {cfg.label}
    </span>
  );
}

function PipelineProgress({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  if (status === "done" || status === "error") return null;
  return (
    <div className="mt-2">
      <Progress value={cfg.progress} className="h-1.5" />
    </div>
  );
}

function DropZone({ onFile }: { onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
        dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
      <p className="text-sm font-medium text-gray-700">Drop a video file here or click to browse</p>
      <p className="text-xs text-gray-500 mt-1">MP4, MOV, MKV, WebM — up to 2 GB</p>
    </div>
  );
}

function ProjectCard({
  project,
  onTranscribe,
  onEdit,
  onRefresh,
}: {
  project: VideoProject;
  onTranscribe: (id: number) => void;
  onEdit: (id: number) => void;
  onRefresh: (id: number) => void;
}) {
  const isActive = ["transcribing", "editing", "rendering", "adding_graphics"].includes(project.status);

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FileVideo className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{project.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(project.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={project.status} />
            {isActive && (
              <button
                onClick={() => onRefresh(project.id)}
                className="text-gray-400 hover:text-gray-600"
                title="Refresh status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <PipelineProgress status={project.status} />

        {project.errorMessage && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg p-2.5 font-mono break-all">
            {project.errorMessage}
          </div>
        )}

        {/* Pipeline step buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.status === "pending" && (
            <Button size="sm" variant="outline" onClick={() => onTranscribe(project.id)} className="gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              Transcribe
            </Button>
          )}

          {project.status === "transcribed" && (
            <Button size="sm" onClick={() => onEdit(project.id)} className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Scissors className="w-3.5 h-3.5" />
              Remove Fillers + Render
            </Button>
          )}

          {project.status === "done" && (
            <a href={`/api/video/${project.id}/download`} download>
              <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700">
                <Download className="w-3.5 h-3.5" />
                Download Final MP4
              </Button>
            </a>
          )}

          {project.status === "error" && (
            <Button size="sm" variant="outline" onClick={() => onTranscribe(project.id)} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VideoStudio() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: projects = [], isLoading } = useQuery<VideoProject[]>({
    queryKey: ["/api/video"],
    refetchInterval: (query) => {
      const list = query.state.data as VideoProject[] | undefined;
      const active = list?.some((p) =>
        ["transcribing", "editing", "rendering", "adding_graphics"].includes(p.status)
      );
      return active ? 4000 : false;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("video", file);
      fd.append("name", file.name);
      const res = await fetch("/api/video/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video"] });
      toast({ title: "Video uploaded", description: "Ready to transcribe." });
    },
    onError: (e: Error) => toast({ title: "Upload failed", description: e.message, variant: "destructive" }),
    onSettled: () => setUploading(false),
  });

  const transcribeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/video/${id}/transcribe`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video"] });
      toast({ title: "Transcription started", description: "This may take a few minutes." });
    },
    onError: (e: Error) => toast({ title: "Transcription failed", description: e.message, variant: "destructive" }),
  });

  const editMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/video/${id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minSilence: 0.3, grade: "auto", subtitles: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video"] });
      toast({ title: "Edit pipeline started", description: "Removing fillers and rendering…" });
    },
    onError: (e: Error) => toast({ title: "Edit failed", description: e.message, variant: "destructive" }),
  });

  const handleFile = (file: File) => {
    setUploading(true);
    uploadMutation.mutate(file);
  };

  const refreshProject = (id: number) => {
    queryClient.invalidateQueries({ queryKey: ["/api/video"] });
  };

  const activeCount = projects.filter((p) =>
    ["transcribing", "editing", "rendering"].includes(p.status)
  ).length;
  const doneCount = projects.filter((p) => p.status === "done").length;

  return (
    <div className="flex-1 overflow-auto p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Video Studio</h1>
              <p className="text-sm text-gray-500">Upload → Transcribe → Remove Fillers → Add Motion Graphics → Export</p>
            </div>
          </div>

          {/* Stats row */}
          {projects.length > 0 && (
            <div className="flex gap-4 mt-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{projects.length}</span> project{projects.length !== 1 ? "s" : ""}
              </div>
              {activeCount > 0 && (
                <div className="text-sm text-blue-600 flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {activeCount} processing
                </div>
              )}
              {doneCount > 0 && (
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {doneCount} ready
                </div>
              )}
            </div>
          )}
        </div>

        <Tabs defaultValue="upload">
          <TabsList className="mb-6">
            <TabsTrigger value="upload" className="gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              New Video
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-1.5">
              <Film className="w-3.5 h-3.5" />
              Projects
              {projects.length > 0 && (
                <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {projects.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              How it works
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Raw Video</CardTitle>
                <CardDescription>
                  Drop in your raw footage. We'll transcribe it word-by-word, remove filler words (umm, uh, er…), and render a clean final MP4.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploading ? (
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-12 text-center bg-blue-50">
                    <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-4 animate-spin" />
                    <p className="text-sm font-medium text-blue-700">Uploading…</p>
                  </div>
                ) : (
                  <DropZone onFile={handleFile} />
                )}

                {/* Quick pipeline overview */}
                <div className="mt-6 grid grid-cols-4 gap-3">
                  {[
                    { icon: Upload, label: "Upload", desc: "Raw footage" },
                    { icon: Mic, label: "Transcribe", desc: "Word timestamps" },
                    { icon: Scissors, label: "Edit", desc: "Remove fillers" },
                    { icon: Sparkles, label: "Graphics", desc: "Motion overlays" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <Icon className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Film className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">No projects yet</p>
                  <p className="text-xs text-gray-400 mt-1">Upload a video to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onTranscribe={() => transcribeMutation.mutate(p.id)}
                    onEdit={() => editMutation.mutate(p.id)}
                    onRefresh={refreshProject}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle>Full Pipeline</CardTitle>
                <CardDescription>How your video goes from raw footage to polished final MP4</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      icon: Upload,
                      title: "Upload",
                      desc: "Drop in raw footage up to 2 GB. MP4, MOV, MKV, WebM all work.",
                      color: "bg-gray-100 text-gray-600",
                    },
                    {
                      step: "2",
                      icon: Mic,
                      title: "Transcribe",
                      desc: "ElevenLabs Scribe gives word-level timestamps with speaker diarization. Cached — only transcribed once per file.",
                      color: "bg-blue-100 text-blue-600",
                    },
                    {
                      step: "3",
                      icon: Scissors,
                      title: "Filler Removal",
                      desc: "Cuts umm, uh, um, er, hmm on word boundaries. 30ms audio fades at every cut prevent pops. Silence gaps ≥ 300ms are removed.",
                      color: "bg-yellow-100 text-yellow-600",
                    },
                    {
                      step: "4",
                      icon: Play,
                      title: "Render",
                      desc: "Per-segment extraction + lossless concat + loudness normalization to -14 LUFS. HDR tone-mapping included.",
                      color: "bg-orange-100 text-orange-600",
                    },
                    {
                      step: "5",
                      icon: Sparkles,
                      title: "Motion Graphics",
                      desc: "HyperFrames renders HTML compositions (GSAP, Lottie, Three.js) to MP4 overlays — lower thirds, title cards, animated charts.",
                      color: "bg-purple-100 text-purple-600",
                    },
                    {
                      step: "6",
                      icon: Download,
                      title: "Export",
                      desc: "Download your final.mp4 — 1080p, H.264, social-media ready.",
                      color: "bg-green-100 text-green-600",
                    },
                  ].map(({ step, icon: Icon, title, desc, color }) => (
                    <div key={step} className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{step}. {title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Motion graphics via HyperFrames</p>
                  <p className="text-xs text-blue-700">
                    Lower thirds, title cards, animated charts, social CTAs. Composed in HTML + GSAP, rendered deterministically to MP4.
                    Templates in <code className="font-mono bg-blue-100 px-1 rounded">video-pipeline/hyperframes/</code>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
