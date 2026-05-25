import { describe, expect, it } from "vitest";
import { difficultyOrder, gameConfigs } from "./config";

describe("difficulty config", () => {
  it("exposes the intended difficulty order", () => {
    expect(difficultyOrder).toEqual(["easy", "medium", "hard"]);
  });

  it("scales major danger values upward by difficulty", () => {
    expect(gameConfigs.easy.fireballSpeed).toBeLessThan(gameConfigs.medium.fireballSpeed);
    expect(gameConfigs.medium.fireballSpeed).toBeLessThan(gameConfigs.hard.fireballSpeed);
    expect(gameConfigs.easy.swordDamage).toBeLessThan(gameConfigs.medium.swordDamage);
    expect(gameConfigs.medium.swordDamage).toBeLessThan(gameConfigs.hard.swordDamage);
  });

  it("gives hard mode tighter reaction time than easy mode", () => {
    expect(gameConfigs.hard.swordTelegraphMs).toBeLessThan(gameConfigs.easy.swordTelegraphMs);
    expect(gameConfigs.hard.bossAttackCooldownMs).toBeLessThan(gameConfigs.easy.bossAttackCooldownMs);
  });
});
