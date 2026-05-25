export type Difficulty = "easy" | "medium" | "hard";

export type GamePhase = "menu" | "playing" | "won" | "lost";

export interface GameConfig {
  bossHealth: number;
  cursorHealth: number;
  bossMoveSpeed: number;
  bossAttackCooldownMs: number;
  bossEnrageHealthRatio: number;
  swordRange: number;
  swordDamage: number;
  swordTelegraphMs: number;
  fireballSpeed: number;
  fireballDamage: number;
  fireballCooldownMs: number;
  pokeDamage: number;
  pokeCooldownMs: number;
}

export interface CombatantState {
  health: number;
  maxHealth: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface AssetManifest {
  boss: {
    idle: string;
    move: string;
    attack: string;
    hurt: string;
    defeated: string;
  };
  cursor: {
    normal: string;
    hurt: string;
    defeated: string;
  };
  effects: {
    swordSlash: string;
    fireball: string;
    hit: string;
    explosion: string;
  };
  items: {
    pointerPoke?: string;
  };
  backgrounds: {
    arena?: string;
  };
  audio: {
    poke?: string;
    sword?: string;
    fireball?: string;
    victory?: string;
    defeat?: string;
  };
}
