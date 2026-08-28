"use client";

import { useLayoutEffect } from "react";

/** Only tighten once list copy crosses above the brown note (not the padding zone edge). */
const NOTE_GAP_PX = 16;

function measureNoteOverflow(content: HTMLElement): number {
  const paddingBottom = Number.parseFloat(getComputedStyle(content).paddingBottom);
  const { bottom: boxBottom } = content.getBoundingClientRect();
  // Note sits in the lower portion of the bottom padding; keep a gap above it.
  const noteTop = boxBottom - paddingBottom * 0.35;
  const safeTextBottom = noteTop - NOTE_GAP_PX;
  const list = content.querySelector("ol");
  if (!list) return 0;
  return list.getBoundingClientRect().bottom - safeTextBottom;
}

function applyFit(content: HTMLElement) {
  content.removeAttribute("data-fit");

  if (measureNoteOverflow(content) <= 0) return;

  content.dataset.fit = "tight";
  void content.offsetHeight;
  if (measureNoteOverflow(content) <= 0) return;

  content.dataset.fit = "tighter";
}

/** Observes menu favorites content; only adds data-fit when copy reaches the brown note. */
export function MenuFavoritesFit({ targetId }: { targetId: string }) {
  useLayoutEffect(() => {
    const content = document.getElementById(targetId);
    if (!content) return;

    const update = () => applyFit(content);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(content);
    if (content.parentElement) observer.observe(content.parentElement);

    document.fonts?.ready.then(update);

    return () => observer.disconnect();
  }, [targetId]);

  return null;
}
