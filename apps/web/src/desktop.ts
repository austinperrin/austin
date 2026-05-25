export interface DesktopCapability {
  allowed: boolean;
  reason: "ok" | "coarse-pointer" | "small-viewport";
}

export function getDesktopCapability(
  width?: number,
  height?: number,
  coarsePointer?: boolean
): DesktopCapability {
  const viewportWidth = width ?? window.innerWidth;
  const viewportHeight = height ?? window.innerHeight;
  const hasCoarsePointer =
    coarsePointer ?? window.matchMedia?.("(pointer: coarse)").matches ?? false;

  if (hasCoarsePointer) {
    return { allowed: false, reason: "coarse-pointer" };
  }

  if (viewportWidth < 900 || viewportHeight < 600) {
    return { allowed: false, reason: "small-viewport" };
  }

  return { allowed: true, reason: "ok" };
}
