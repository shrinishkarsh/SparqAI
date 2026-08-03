"""Pack transcript JSONs into a compact phrase-level markdown for LLM reasoning.

Groups word-level Scribe output into phrases by breaking on silence ≥ threshold
or speaker change. Produces ~12KB markdown from ~120KB of raw JSON.

Usage:
    python video-pipeline/helpers/pack_transcripts.py --edit-dir <path>
    python video-pipeline/helpers/pack_transcripts.py --edit-dir <path> --silence 0.4
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def fmt_ts(seconds: float) -> str:
    """Fixed-width timestamp: 000.00"""
    return f"{seconds:06.2f}"


def fmt_dur(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.1f}s"
    m = int(seconds // 60)
    s = seconds % 60
    return f"{m}m {s:.1f}s"


def group_into_phrases(
    words: list[dict],
    silence_threshold: float = 0.5,
) -> list[dict]:
    """Group word entries into phrase-level records."""
    phrases = []
    current: list[dict] = []
    current_speaker = None

    for w in words:
        wtype = w.get("type", "word")
        if wtype not in ("word", "spacing"):
            continue

        speaker = w.get("speaker_id")
        start = w.get("start", 0.0)
        end = w.get("end", start)

        if current:
            last_end = current[-1].get("end", 0.0)
            gap = start - last_end
            speaker_changed = speaker is not None and speaker != current_speaker
            if gap >= silence_threshold or speaker_changed:
                phrases.append(_make_phrase(current))
                current = []

        current.append(w)
        if speaker is not None:
            current_speaker = speaker

    if current:
        phrases.append(_make_phrase(current))

    return phrases


def _make_phrase(words: list[dict]) -> dict:
    text_parts = []
    for w in words:
        t = w.get("text", "")
        if t.strip():
            text_parts.append(t)

    start = words[0].get("start", 0.0)
    end = words[-1].get("end", start)
    speaker = words[0].get("speaker_id", "S0")

    return {
        "start": start,
        "end": end,
        "speaker": speaker,
        "text": "".join(text_parts).strip(),
    }


def pack_one(transcript_path: Path, silence: float) -> list[dict]:
    data = json.loads(transcript_path.read_text())
    words = data.get("words", [])
    return group_into_phrases(words, silence_threshold=silence)


def build_markdown(
    transcripts_dir: Path,
    silence: float,
) -> str:
    lines = [
        "# Packed Transcripts",
        f"",
        f"Silence threshold: {silence}s — phrases break on gaps ≥ this or speaker change.",
        "",
    ]

    json_files = sorted(transcripts_dir.glob("*.json"))
    if not json_files:
        lines.append("_No transcripts found._")
        return "\n".join(lines)

    for jf in json_files:
        phrases = pack_one(jf, silence)
        total_dur = phrases[-1]["end"] if phrases else 0.0
        lines.append(f"## {jf.stem}  (duration: {fmt_dur(total_dur)}, {len(phrases)} phrases)")
        for p in phrases:
            ts = f"[{fmt_ts(p['start'])}-{fmt_ts(p['end'])}]"
            spk = p["speaker"] or "S0"
            lines.append(f"  {ts} {spk} {p['text']}")
        lines.append("")

    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--edit-dir", type=Path, required=True)
    ap.add_argument("--silence", type=float, default=0.5)
    ap.add_argument("--output", type=Path, default=None)
    args = ap.parse_args()

    transcripts_dir = args.edit_dir / "transcripts"
    if not transcripts_dir.exists():
        print(f"No transcripts directory at {transcripts_dir}")
        return

    md = build_markdown(transcripts_dir, args.silence)
    out = args.output or (args.edit_dir / "takes_packed.md")
    out.write_text(md)
    kb = out.stat().st_size / 1024
    print(f"Packed {kb:.1f} KB → {out}")


if __name__ == "__main__":
    main()
