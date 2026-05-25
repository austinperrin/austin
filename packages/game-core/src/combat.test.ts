import { describe, expect, it } from "vitest";
import { applyDamage, circlesOverlap, getGamePhase, isBossEnraged, pointInCircle } from "./combat";
import { gameConfigs } from "./config";

describe("combat helpers", () => {
  it("applies damage without dropping below zero", () => {
    expect(applyDamage({ health: 8, maxHealth: 20 }, 12)).toEqual({ health: 0, maxHealth: 20 });
  });

  it("does not increase health when damage is negative", () => {
    expect(applyDamage({ health: 8, maxHealth: 20 }, -12)).toEqual({ health: 8, maxHealth: 20 });
  });

  it("detects boss enrage threshold from difficulty config", () => {
    expect(isBossEnraged({ health: 48, maxHealth: 120 }, gameConfigs.medium)).toBe(true);
    expect(isBossEnraged({ health: 60, maxHealth: 120 }, gameConfigs.medium)).toBe(false);
  });

  it("detects point and circle collision", () => {
    expect(pointInCircle({ x: 12, y: 10 }, { x: 10, y: 10, radius: 3 })).toBe(true);
    expect(circlesOverlap({ x: 0, y: 0, radius: 10 }, { x: 18, y: 0, radius: 10 })).toBe(true);
  });

  it("prioritizes cursor defeat over boss defeat", () => {
    const defeated = { health: 0, maxHealth: 100 };
    expect(getGamePhase(defeated, defeated)).toBe("lost");
    expect(getGamePhase(defeated, { health: 1, maxHealth: 100 })).toBe("won");
    expect(getGamePhase({ health: 1, maxHealth: 100 }, defeated)).toBe("lost");
  });
});
