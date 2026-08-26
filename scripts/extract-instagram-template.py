#!/usr/bin/env python3
"""Extract the three panels from Calmo's Instagram template video."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

# Separator bands detected in the 720×1280 template (y inclusive).
TOP_END = 421
MIDDLE_START = 437
MIDDLE_END = 843
BOTTOM_START = 861

PANELS = {
    "menu": (0, 0, 720, TOP_END),
    "interior": (0, MIDDLE_START, 720, MIDDLE_END),
    "pastries": (0, BOTTOM_START, 720, 1280),
}


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: extract-instagram-template.py <input.mp4> <output-dir>")
        sys.exit(1)

    source = Path(sys.argv[1]).expanduser().resolve()
    output_dir = Path(sys.argv[2]).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    if not source.is_file():
        raise SystemExit(f"Video not found: {source}")

    menu_out = output_dir / "gallery-menu.jpg"
    pastries_out = output_dir / "gallery-pastries.jpg"
    video_out = output_dir / "gallery-interior.mp4"

    crop_menu = f"crop={PANELS['menu'][2]}:{PANELS['menu'][3]}:0:0"
    crop_pastries = f"crop=720:{1280 - BOTTOM_START}:0:{BOTTOM_START}"
    crop_video = (
        f"crop=720:{MIDDLE_END - MIDDLE_START}:0:{MIDDLE_START},"
        "delogo=x=186:y=191:w=220:h=45"
    )

    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(source),
            "-vf",
            crop_menu,
            "-frames:v",
            "1",
            "-update",
            "1",
            str(menu_out),
        ],
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(source),
            "-vf",
            crop_pastries,
            "-frames:v",
            "1",
            "-update",
            "1",
            str(pastries_out),
        ],
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(source),
            "-vf",
            crop_video,
            "-an",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(video_out),
        ],
    )

    print(f"Wrote {menu_out}")
    print(f"Wrote {pastries_out}")
    print(f"Wrote {video_out}")


if __name__ == "__main__":
    main()
