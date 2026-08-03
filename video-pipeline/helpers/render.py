"""Execute an EDL against source video(s) and produce a final MP4.

Pipeline:
  1. Per-segment extraction with color grading + 30ms audio fades
  2. Lossless concatenation (FFmpeg concat demuxer)
  3. Overlay / subtitle composition with PTS shifting
  4. Loudness normalization to -14 LUFS

EDL JSON format:
{
  "source": "input.mp4",
  "segments": [
    { "start": 0.0, "end": 4.2, "grade": "auto" },
    { "start": 5.1, "end": 12.8, "grade": "neutral_punch" }
  ],
  "subtitles": true,
  "normalize_audio": true,
  "overlay": "overlay.mp4"   // optional HyperFrames output
}

Usage:
    python video-pipeline/helpers/render.py <edl.json> --video <input.mp4> --edit-dir <dir>
    python video-pipeline/helpers/render.py <edl.json> --quality draft
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path


QUALITY_PRESETS = {
    "final":   {"crf": "20", "preset": "fast",      "scale": "1920:1080"},
    "preview": {"crf": "22", "preset": "medium",    "scale": "1920:1080"},
    "draft":   {"crf": "28", "preset": "ultrafast", "scale": "1280:720"},
}

FADE_MS = 30
FADE_S = FADE_MS / 1000.0


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, **kwargs)


def grade_filter(grade: str) -> str:
    presets = {
        "subtle":          "eq=contrast=1.02:brightness=0.01:saturation=1.05",
        "neutral_punch":   "eq=contrast=1.08:brightness=0.0:saturation=1.1,curves=all='0/0 0.5/0.52 1/1'",
        "warm_cinematic":  "eq=contrast=1.05:brightness=0.02:saturation=1.2,colorbalance=rs=0.05:gs=0:bs=-0.05",
        "none":            "null",
        "auto":            "eq=contrast=1.04:brightness=0.01:saturation=1.08",
    }
    return presets.get(grade, presets["auto"])


def extract_segment(
    source: Path,
    start: float,
    end: float,
    grade: str,
    out_path: Path,
    quality: str = "preview",
) -> None:
    """Extract a single segment with grade and audio fades."""
    q = QUALITY_PRESETS[quality]
    duration = end - start
    vf = f"{grade_filter(grade)},scale={q['scale']}"

    # Audio fade in at start, fade out before end
    af = f"afade=t=in:st=0:d={FADE_S},afade=t=out:st={max(0, duration - FADE_S):.3f}:d={FADE_S}"

    cmd = [
        "ffmpeg", "-y",
        "-ss", str(start),
        "-to", str(end),
        "-i", str(source),
        "-vf", vf,
        "-af", af,
        "-c:v", "libx264",
        "-crf", q["crf"],
        "-preset", q["preset"],
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        str(out_path),
    ]
    run(cmd)


def concat_segments(segment_paths: list[Path], out_path: Path) -> None:
    """Losslessly concatenate pre-encoded segments."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
        for p in segment_paths:
            f.write(f"file '{p.resolve()}'\n")
        list_path = f.name

    try:
        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", list_path,
            "-c", "copy",
            str(out_path),
        ]
        run(cmd)
    finally:
        os.unlink(list_path)


def apply_overlay(base: Path, overlay: Path, out_path: Path) -> None:
    """Composite an overlay MP4 over the base video."""
    cmd = [
        "ffmpeg", "-y",
        "-i", str(base),
        "-i", str(overlay),
        "-filter_complex",
        "[0:v][1:v]overlay=0:0[v]",
        "-map", "[v]",
        "-map", "0:a",
        "-c:v", "libx264",
        "-crf", "20",
        "-preset", "fast",
        "-c:a", "copy",
        str(out_path),
    ]
    run(cmd)


def normalize_audio(video: Path, out_path: Path, target_lufs: float = -14.0) -> None:
    """Two-pass loudness normalization."""
    # Pass 1: measure
    probe = subprocess.run(
        [
            "ffmpeg", "-i", str(video),
            "-af", f"loudnorm=I={target_lufs}:TP=-1.5:LRA=11:print_format=json",
            "-f", "null", "-",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    stderr = probe.stderr.decode()
    # Extract JSON from loudnorm output
    start = stderr.rfind("{")
    end = stderr.rfind("}") + 1
    if start == -1 or end == 0:
        # Fall back to simple copy if measurement fails
        import shutil
        shutil.copy2(str(video), str(out_path))
        return

    stats = json.loads(stderr[start:end])

    # Pass 2: apply
    af = (
        f"loudnorm=I={target_lufs}:TP=-1.5:LRA=11"
        f":measured_I={stats['input_i']}"
        f":measured_TP={stats['input_tp']}"
        f":measured_LRA={stats['input_lra']}"
        f":measured_thresh={stats['input_thresh']}"
        f":offset={stats['target_offset']}"
        f":linear=true:print_format=summary"
    )
    run([
        "ffmpeg", "-y",
        "-i", str(video),
        "-af", af,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        str(out_path),
    ])


def render_edl(
    edl: dict,
    video_path: Path,
    edit_dir: Path,
    quality: str = "preview",
) -> Path:
    """Full render pipeline. Returns path to final output."""
    segments = edl.get("segments", [])
    if not segments:
        sys.exit("EDL has no segments")

    edit_dir.mkdir(parents=True, exist_ok=True)
    segs_dir = edit_dir / "segments"
    segs_dir.mkdir(exist_ok=True)

    # Step 1: extract + grade each segment
    seg_paths: list[Path] = []
    for i, seg in enumerate(segments):
        out = segs_dir / f"seg_{i:04d}.mp4"
        grade = seg.get("grade", "auto")
        print(f"  segment {i+1}/{len(segments)}: {seg['start']:.2f}–{seg['end']:.2f}s [{grade}]")
        extract_segment(
            source=video_path,
            start=seg["start"],
            end=seg["end"],
            grade=grade,
            out_path=out,
            quality=quality,
        )
        seg_paths.append(out)

    # Step 2: concat
    concat_out = edit_dir / "concat.mp4"
    print(f"  concatenating {len(seg_paths)} segments…")
    concat_segments(seg_paths, concat_out)

    # Step 3: overlay (optional)
    overlay_path = edl.get("overlay")
    if overlay_path:
        overlay_file = Path(overlay_path)
        if overlay_file.exists():
            print(f"  compositing overlay: {overlay_file.name}")
            overlaid = edit_dir / "overlaid.mp4"
            apply_overlay(concat_out, overlay_file, overlaid)
            concat_out = overlaid

    # Step 4: loudness normalization
    if edl.get("normalize_audio", True):
        print("  normalizing audio to -14 LUFS…")
        normalized = edit_dir / "normalized.mp4"
        normalize_audio(concat_out, normalized)
        concat_out = normalized

    # Final output
    final = edit_dir / "final.mp4"
    import shutil
    shutil.copy2(str(concat_out), str(final))
    size_mb = final.stat().st_size / (1024 * 1024)
    print(f"  → {final} ({size_mb:.1f} MB)")
    return final


def main() -> None:
    ap = argparse.ArgumentParser(description="Render an EDL to MP4")
    ap.add_argument("edl", type=Path, help="Path to EDL JSON file")
    ap.add_argument("--video", type=Path, required=True, help="Source video")
    ap.add_argument("--edit-dir", type=Path, default=None)
    ap.add_argument("--quality", choices=["final", "preview", "draft"], default="preview")
    args = ap.parse_args()

    edl_path = args.edl.resolve()
    if not edl_path.exists():
        sys.exit(f"EDL not found: {edl_path}")

    edl = json.loads(edl_path.read_text())
    video = args.video.resolve()
    if not video.exists():
        sys.exit(f"Video not found: {video}")

    edit_dir = (args.edit_dir or video.parent / "edit").resolve()
    render_edl(edl, video, edit_dir, quality=args.quality)


if __name__ == "__main__":
    main()
