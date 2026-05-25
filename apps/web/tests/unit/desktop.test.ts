import { describe, expect, it } from "vitest";
import { getDesktopCapability } from "../../src/desktop";

describe("desktop capability", () => {
  it("allows large fine-pointer viewports", () => {
    expect(getDesktopCapability(1280, 720, false)).toEqual({ allowed: true, reason: "ok" });
  });

  it("blocks coarse pointers", () => {
    expect(getDesktopCapability(1280, 720, true)).toEqual({
      allowed: false,
      reason: "coarse-pointer"
    });
  });

  it("blocks small viewports", () => {
    expect(getDesktopCapability(800, 600, false)).toEqual({
      allowed: false,
      reason: "small-viewport"
    });
  });
});
