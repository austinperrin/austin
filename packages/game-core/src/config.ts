import type { Difficulty, GameConfig } from "./types";

export const difficultyOrder: Difficulty[] = ["easy", "medium", "hard"];

export const gameConfigs: Record<Difficulty, GameConfig> = {
  easy: {
    bossHealth: 90,
    cursorHealth: 120,
    bossMoveSpeed: 90,
    bossAttackCooldownMs: 1550,
    bossEnrageHealthRatio: 0.35,
    swordRange: 86,
    swordDamage: 10,
    swordTelegraphMs: 520,
    fireballSpeed: 210,
    fireballDamage: 12,
    fireballCooldownMs: 1750,
    pokeDamage: 10,
    pokeCooldownMs: 260
  },
  medium: {
    bossHealth: 120,
    cursorHealth: 100,
    bossMoveSpeed: 125,
    bossAttackCooldownMs: 1200,
    bossEnrageHealthRatio: 0.4,
    swordRange: 104,
    swordDamage: 16,
    swordTelegraphMs: 420,
    fireballSpeed: 280,
    fireballDamage: 18,
    fireballCooldownMs: 1350,
    pokeDamage: 9,
    pokeCooldownMs: 320
  },
  hard: {
    bossHealth: 150,
    cursorHealth: 85,
    bossMoveSpeed: 165,
    bossAttackCooldownMs: 900,
    bossEnrageHealthRatio: 0.45,
    swordRange: 126,
    swordDamage: 24,
    swordTelegraphMs: 310,
    fireballSpeed: 365,
    fireballDamage: 25,
    fireballCooldownMs: 980,
    pokeDamage: 8,
    pokeCooldownMs: 380
  }
};

export function getGameConfig(difficulty: Difficulty): GameConfig {
  return gameConfigs[difficulty];
}
