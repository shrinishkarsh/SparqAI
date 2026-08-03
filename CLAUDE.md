# SparqAI — Video Editing Studio

This project is a full video editing pipeline. You can accept a raw video file, remove filler words, color grade, add motion graphics via HyperFrames, and produce a polished final.mp4.

## Tech Stack

- **Backend**: Node.js + Express (TypeScript), PostgreSQL via Neon + Drizzle ORM
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui, Wouter routing
- **Video pipeline**: Python 3.11+ with FFmpeg, ElevenLabs Scribe for transcription
- **Motion graphics**: HyperFrames (Node.js 22+, HTML → MP4)

## Video Pipeline Overview

Pipeline flow: **Upload → Transcribe → Pack → Edit (filler removal + cuts) → Grade → Render → Motion Graphics → Final MP4**

All outputs go to `uploads/videos/<project_id>/edit/`.

### Required env vars (add to `.env`)

```
ELEVENLABS_API_KEY=your_key_here
```

### Python dependencies

```bash
cd video-pipeline
pip install requests librosa matplotlib pillow numpy
```

### System dependencies

```bash
# Ubuntu/Debian
sudo apt-get install -y ffmpeg

# macOS
brew install ffmpeg
```

---

## Pipeline Helpers (`video-pipeline/helpers/`)

### `transcribe.py`
Calls ElevenLabs Scribe to get word-level timestamps with speaker diarization.

```bash
python video-pipeline/helpers/transcribe.py <video_path> [--edit-dir <dir>] [--language en]
```

Output: `<edit_dir>/transcripts/<stem>.json`

### `pack_transcripts.py`
Compresses transcripts into a phrase-level markdown (groups on silence ≥0.5s). The LLM reads this compact format to decide cuts.

```bash
python video-pipeline/helpers/pack_transcripts.py --edit-dir <dir>
```

Output: `<edit_dir>/takes_packed.md`

### `render.py`
Executes an EDL (Edit Decision List) against the source video:
1. Per-segment extraction with color grading + 30ms audio fades
2. Lossless concat
3. Overlay/subtitle composition with PTS shifting
4. Loudness normalization to -14 LUFS

```bash
python video-pipeline/helpers/render.py <edl.json> --video <input.mp4> --edit-dir <dir>
```

### `grade.py`
Color grades video. Auto mode analyzes brightness/contrast/saturation and applies bounded corrections (±8% per axis).

```bash
python video-pipeline/helpers/grade.py <input> -o <output> [--preset warm_cinematic|neutral_punch|subtle|none]
```

### `timeline_view.py`
Generates a composite PNG (filmstrip + waveform + word labels + silence regions) for visual decision-making.

```bash
python video-pipeline/helpers/timeline_view.py <video> <start_sec> <end_sec>
```

---

## EDL Format

When removing filler words or cutting segments, produce a JSON EDL like:

```json
{
  "source": "input.mp4",
  "segments": [
    { "start": 0.0, "end": 4.2, "grade": "auto" },
    { "start": 5.1, "end": 12.8, "grade": "auto" },
    { "start": 13.4, "end": 30.0, "grade": "warm_cinematic" }
  ],
  "subtitles": true,
  "normalize_audio": true
}
```

Gaps between segments are the cuts. Never cut inside a word boundary — use word timestamps from the transcript to set segment edges.

### Filler word removal rules (non-negotiable)

1. Only cut on word boundaries from the transcript
2. Pad cut edges by 30–200ms working window to avoid clipping
3. Apply 30ms audio fade at every cut boundary
4. Never cut inside a phrase — only at silence gaps ≥0.3s
5. Fillers to remove by default: `umm`, `uh`, `um`, `er`, `like` (as filler), `you know`, `so` (sentence-opening filler)

---

## Motion Graphics via HyperFrames

HyperFrames renders HTML compositions to MP4. Install it:

```bash
# Requires Node.js 22+
npx hyperframes init video-pipeline/hyperframes/<project_name>
cd video-pipeline/hyperframes/<project_name>
npx hyperframes preview   # test in browser
npx hyperframes render    # → output.mp4
```

### HTML Composition Format

```html
<div id="stage" data-composition-id="overlay" data-start="0" data-width="1920" data-height="1080">
  <!-- Lower third title card — appears at 2s, lasts 4s -->
  <div class="clip" data-start="2" data-duration="4" style="position:absolute;bottom:120px;left:80px;">
    <h2 style="font-size:48px;color:white;font-weight:700;">Your Name</h2>
    <p style="font-size:28px;color:#60A5FA;">Your Title</p>
  </div>
</div>
```

### Key data attributes

| Attribute | Purpose |
|-----------|---------|
| `data-composition-id` | Unique composition ID |
| `data-start` | Timeline start (seconds) |
| `data-duration` | Duration (seconds) |
| `data-track-index` | Layer assignment |
| `data-volume` | Audio level 0–1 |

### Pre-built overlay commands

```bash
npx hyperframes add instagram-follow   # social CTA overlay
npx hyperframes add lower-third        # speaker title card
npx hyperframes add data-chart         # animated chart
npx hyperframes add flash-through-white  # transition
```

### Overlay composition with main video

After rendering the HyperFrames overlay (transparent background MP4), composite it over your main video:

```bash
ffmpeg -i main.mp4 -i overlay.mp4 \
  -filter_complex "[0:v][1:v]overlay=0:0:enable='between(t,2,6)'" \
  -c:a copy output.mp4
```

Use `setpts=PTS-STARTPTS+2/TB` to shift overlay PTS when the overlay should start at a specific time.

---

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/video/upload` | Upload raw video |
| POST | `/api/video/:id/transcribe` | Run ElevenLabs transcription |
| GET | `/api/video/:id/transcript` | Get packed transcript markdown |
| POST | `/api/video/:id/edit` | Run filler removal + render |
| POST | `/api/video/:id/motion-graphics` | Add HyperFrames overlay |
| GET | `/api/video/:id/status` | Poll job status |
| GET | `/api/video/:id/download` | Stream final MP4 |
| GET | `/api/video` | List all projects |

---

## Production Rules (always follow)

1. **Subtitles applied last** in filter chain
2. **Per-segment extract + lossless concat** (never single-pass filtergraph over the whole file)
3. **30ms audio fades at every cut**
4. **Overlay PTS shifting**: `setpts=PTS-STARTPTS+T/TB`
5. **Master SRT uses output-timeline offsets**
6. **Never cut inside words**
7. **Pad cut edges** (30–200ms working window)
8. **Cache transcripts** per source file (skip re-transcribing)
9. **Parallel sub-agents for animations** (HyperFrames renders independently)
10. **Self-evaluate output**: after render, check cut boundaries with `timeline_view.py`
11. **All outputs** go to `uploads/videos/<project_id>/edit/`

---

## HyperFrames CLI Reference

```bash
npx hyperframes init <project>     # scaffold new composition
npx hyperframes preview            # browser preview with live reload
npx hyperframes lint               # validate composition structure
npx hyperframes render             # encode to MP4
npx hyperframes snapshot           # capture single frame
npx hyperframes add <component>    # install overlay from catalog
```

Animation libraries supported: GSAP, CSS Keyframes, Lottie, Three.js, Anime.js, WAAPI.

Animations must be **seekable** — the renderer pauses at each frame position rather than playing in real time. Avoid `Date.now()`, unseeded randomness, or runtime network calls in compositions.

---

## Database Schema (video_projects table)

Located in `shared/schema.ts`. Key fields:
- `status`: `pending | transcribing | editing | rendering | adding_graphics | done | error`
- `editConfig`: JSON — which fillers to remove, color grade preset, subtitles on/off
- `motionGraphicsConfig`: JSON — overlay type, timing, text content
- `metadata`: JSON — duration, resolution, word count, etc.
