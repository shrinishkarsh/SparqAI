"""Generate an EDL from a transcript that removes filler words and silence gaps.

Fillers removed by default: umm, uh, um, er, hmm
Optional: like (as filler), you know, so (sentence-opening)

Usage:
    python video-pipeline/helpers/filler_remove.py <transcript.json> --output <edl.json>
    python video-pipeline/helpers/filler_remove.py <transcript.json> --extra-fillers "like,you know"
    python video-pipeline/helpers/filler_remove.py <transcript.json> --min-silence 0.3
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


DEFAULT_FILLERS = {"umm", "uh", "um", "er", "hmm"}
WORD_PAD = 0.05   # 50ms pad around each kept word
MIN_SEGMENT_GAP = 0.10  # merge segments closer than this


def is_filler(word_text: str, filler_set: set[str]) -> bool:
    clean = re.sub(r"[^a-zA-Z ]", "", word_text.lower()).strip()
    return clean in filler_set


def words_to_edl(
    words: list[dict],
    fillers: set[str],
    min_silence: float = 0.3,
    video_duration: float | None = None,
) -> list[dict]:
    """Convert word list into keep-segments, removing fillers and long silences."""
    kept: list[tuple[float, float]] = []

    for w in words:
        if w.get("type") not in ("word", None):
            continue
        text = w.get("text", "")
        if not text.strip():
            continue
        if is_filler(text, fillers):
            continue

        start = max(0.0, w.get("start", 0.0) - WORD_PAD)
        end = w.get("end", start) + WORD_PAD
        kept.append((start, end))

    if not kept:
        return []

    # Merge overlapping/adjacent segments
    merged: list[tuple[float, float]] = [kept[0]]
    for start, end in kept[1:]:
        prev_start, prev_end = merged[-1]
        if start - prev_end <= MIN_SEGMENT_GAP:
            merged[-1] = (prev_start, max(prev_end, end))
        else:
            merged.append((start, end))

    # Remove silence gaps >= min_silence between segments
    final: list[tuple[float, float]] = [merged[0]]
    for start, end in merged[1:]:
        prev_start, prev_end = final[-1]
        gap = start - prev_end
        if gap < min_silence:
            # Close small gap — extend previous segment
            final[-1] = (prev_start, end)
        else:
            final.append((start, end))

    segments = []
    for start, end in final:
        if end - start > 0.1:  # skip segments shorter than 100ms
            segments.append({"start": round(start, 3), "end": round(end, 3), "grade": "auto"})

    return segments


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate filler-removal EDL from transcript")
    ap.add_argument("transcript", type=Path, help="ElevenLabs transcript JSON")
    ap.add_argument("--output", type=Path, default=None)
    ap.add_argument("--extra-fillers", type=str, default="",
                    help="Comma-separated extra filler words to remove")
    ap.add_argument("--min-silence", type=float, default=0.3,
                    help="Minimum silence gap to cut (seconds)")
    ap.add_argument("--subtitles", action="store_true", default=True)
    ap.add_argument("--normalize-audio", action="store_true", default=True)
    args = ap.parse_args()

    if not args.transcript.exists():
        sys.exit(f"Transcript not found: {args.transcript}")

    data = json.loads(args.transcript.read_text())
    words = data.get("words", [])

    fillers = set(DEFAULT_FILLERS)
    if args.extra_fillers:
        fillers.update(w.strip().lower() for w in args.extra_fillers.split(",") if w.strip())

    segments = words_to_edl(words, fillers, min_silence=args.min_silence)

    removed = sum(1 for w in words if w.get("type") in ("word", None) and is_filler(w.get("text", ""), fillers))
    kept_dur = sum(s["end"] - s["start"] for s in segments)

    edl = {
        "source": str(args.transcript.stem),
        "segments": segments,
        "subtitles": args.subtitles,
        "normalize_audio": args.normalize_audio,
        "metadata": {
            "fillers_removed": removed,
            "segments_kept": len(segments),
            "kept_duration_s": round(kept_dur, 2),
        },
    }

    out = args.output or args.transcript.parent.parent / "edl.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(edl, indent=2))

    print(f"EDL written to {out}")
    print(f"  fillers removed: {removed}")
    print(f"  segments kept:   {len(segments)}")
    print(f"  kept duration:   {kept_dur:.1f}s")


if __name__ == "__main__":
    main()
