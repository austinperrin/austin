import type { Circle, CombatantState, GameConfig, Point } from "./types";

export function applyDamage(state: CombatantState, damage: number): CombatantState {
  const nextHealth = Math.max(0, Math.min(state.maxHealth, state.health - Math.max(0, damage)));
  return {
    ...state,
    health: nextHealth
  };
}

export function isDefeated(state: CombatantState): boolean {
  return state.health <= 0;
}

export function healthRatio(state: CombatantState): number {
  if (state.maxHealth <= 0) {
    return 0;
  }

  return state.health / state.maxHealth;
}

export function isBossEnraged(state: CombatantState, config: GameConfig): boolean {
  return healthRatio(state) <= config.bossEnrageHealthRatio;
}

export function pointInCircle(point: Point, circle: Circle): boolean {
  return distance(point, circle) <= circle.radius;
}

export function circlesOverlap(a: Circle, b: Circle): boolean {
  return distance(a, b) <= a.radius + b.radius;
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function getGamePhase(boss: CombatantState, cursor: CombatantState): "playing" | "won" | "lost" {
  if (isDefeated(cursor)) {
    return "lost";
  }

  if (isDefeated(boss)) {
    return "won";
  }

  return "playing";
}
