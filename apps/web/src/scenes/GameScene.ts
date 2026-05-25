import {
  applyDamage,
  circlesOverlap,
  distance,
  getGameConfig,
  getGamePhase,
  isBossEnraged,
  pointInCircle,
  type CombatantState,
  type Difficulty,
  type GameConfig
} from "@poke-the-austin/game-core";
import Phaser from "phaser";
import { SceneKeys, TextureKeys } from "./sceneKeys";

interface GameSceneData {
  difficulty: Difficulty;
}

export class GameScene extends Phaser.Scene {
  private difficulty: Difficulty = "medium";
  private config!: GameConfig;
  private boss!: Phaser.Physics.Arcade.Image;
  private cursor!: Phaser.Physics.Arcade.Image;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private bossHealth!: Phaser.GameObjects.Graphics;
  private cursorHealth!: Phaser.GameObjects.Graphics;
  private bossState!: CombatantState;
  private cursorState!: CombatantState;
  private lastPokeAt = 0;
  private lastAttackAt = 0;
  private lastFireballAt = 0;
  private ended = false;

  constructor() {
    super(SceneKeys.Game);
  }

  create(data: GameSceneData): void {
    document.body.dataset.gameScene = "game";
    this.difficulty = data.difficulty;
    this.config = getGameConfig(this.difficulty);
    this.bossState = { health: this.config.bossHealth, maxHealth: this.config.bossHealth };
    this.cursorState = { health: this.config.cursorHealth, maxHealth: this.config.cursorHealth };
    this.lastPokeAt = 0;
    this.lastAttackAt = 0;
    this.lastFireballAt = 0;
    this.ended = false;

    this.createArena();
    this.createActors();
    this.createHud();
    this.bindInput();
  }

  update(time: number): void {
    if (this.ended) {
      return;
    }

    this.updateCursor();
    this.updateBossMovement();
    this.updateAttacks(time);
    this.drawHud();
  }

  private createArena(): void {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x1f2430).setOrigin(0);
    this.add.grid(width / 2, height / 2, width, height, 48, 48, 0x2e3544, 0.35, 0x15161a, 0.45);
    this.physics.world.setBounds(24, 24, width - 48, height - 48);
    this.input.setDefaultCursor("none");
  }

  private createActors(): void {
    const { width, height } = this.scale;
    this.boss = this.physics.add.image(width / 2, height / 2, TextureKeys.bossIdle);
    this.boss.setCollideWorldBounds(true);
    this.boss.setCircle(28, 0, 8);

    this.cursor = this.physics.add.image(width / 2 + 240, height / 2, TextureKeys.cursorNormal);
    this.cursor.setCircle(18);
    this.cursor.setDepth(20);

    this.fireballs = this.physics.add.group();
    this.physics.add.overlap(this.cursor, this.fireballs, (_cursor, projectile) => {
      this.damageCursor(this.config.fireballDamage);
      projectile.destroy();
    });
  }

  private createHud(): void {
    const { width } = this.scale;
    this.bossHealth = this.add.graphics().setDepth(30);
    this.cursorHealth = this.add.graphics().setDepth(30);
    this.add
      .text(24, 18, "AUSTIN", {
        color: "#f7f2e8",
        fontFamily: "monospace",
        fontSize: "16px"
      })
      .setDepth(31);
    this.add
      .text(width - 24, 18, "CURSOR", {
        color: "#f7f2e8",
        fontFamily: "monospace",
        fontSize: "16px"
      })
      .setOrigin(1, 0)
      .setDepth(31);
    this.add
      .text(width / 2, 18, this.difficulty.toUpperCase(), {
        color: "#f2bd5c",
        fontFamily: "monospace",
        fontSize: "16px"
      })
      .setOrigin(0.5, 0)
      .setDepth(31);
    this.drawHud();
  }

  private bindInput(): void {
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      const now = this.time.now;
      if (now - this.lastPokeAt < this.config.pokeCooldownMs) {
        return;
      }

      this.lastPokeAt = now;
      if (!pointInCircle(pointer, { x: this.boss.x, y: this.boss.y, radius: 42 })) {
        return;
      }

      this.bossState = applyDamage(this.bossState, this.config.pokeDamage);
      this.flashTexture(this.boss, TextureKeys.bossHurt, TextureKeys.bossIdle);
      this.spawnImpact(pointer.x, pointer.y, TextureKeys.hit);
      this.resolvePhase();
    });
  }

  private updateCursor(): void {
    const pointer = this.input.activePointer;
    this.cursor.setPosition(pointer.x, pointer.y);
  }

  private updateBossMovement(): void {
    const pointer = this.input.activePointer;
    const speed = this.config.bossMoveSpeed * (isBossEnraged(this.bossState, this.config) ? 1.3 : 1);
    const gap = distance(this.boss, pointer);

    if (gap > this.config.swordRange * 0.72) {
      this.physics.moveToObject(this.boss, pointer, speed);
      this.boss.setTexture(TextureKeys.bossMove);
    } else {
      this.boss.setVelocity(0, 0);
      this.boss.setTexture(TextureKeys.bossIdle);
    }
  }

  private updateAttacks(time: number): void {
    const cooldown = this.config.bossAttackCooldownMs * (isBossEnraged(this.bossState, this.config) ? 0.7 : 1);

    if (time - this.lastAttackAt < cooldown) {
      return;
    }

    const cursorDistance = distance(this.boss, this.cursor);
    this.lastAttackAt = time;

    if (cursorDistance <= this.config.swordRange) {
      this.swingSword();
      return;
    }

    if (time - this.lastFireballAt >= this.config.fireballCooldownMs) {
      this.lastFireballAt = time;
      this.throwFireball();
    }
  }

  private swingSword(): void {
    this.boss.setTexture(TextureKeys.bossAttack);
    const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.cursor.x, this.cursor.y);
    const slash = this.add
      .image(
        this.boss.x + Math.cos(angle) * 58,
        this.boss.y + Math.sin(angle) * 58,
        TextureKeys.swordSlash
      )
      .setRotation(angle)
      .setAlpha(0.72)
      .setDepth(15);

    this.time.delayedCall(this.config.swordTelegraphMs, () => {
      slash.setAlpha(1);
      if (
        circlesOverlap(
          { x: this.cursor.x, y: this.cursor.y, radius: 18 },
          { x: this.boss.x, y: this.boss.y, radius: this.config.swordRange }
        )
      ) {
        this.damageCursor(this.config.swordDamage);
      }
      this.time.delayedCall(120, () => slash.destroy());
    });
  }

  private throwFireball(): void {
    const projectile = this.fireballs.create(this.boss.x, this.boss.y, TextureKeys.fireball) as
      | Phaser.Physics.Arcade.Image
      | undefined;

    if (!projectile) {
      return;
    }

    projectile.setDepth(12);
    projectile.setCircle(16);
    projectile.setCollideWorldBounds(false);
    this.physics.moveToObject(projectile, this.cursor, this.config.fireballSpeed);
    this.time.delayedCall(3600, () => projectile.destroy());
  }

  private damageCursor(damage: number): void {
    this.cursorState = applyDamage(this.cursorState, damage);
    this.flashTexture(this.cursor, TextureKeys.cursorHurt, TextureKeys.cursorNormal);
    this.spawnImpact(this.cursor.x, this.cursor.y, TextureKeys.explosion);
    this.resolvePhase();
  }

  private resolvePhase(): void {
    const phase = getGamePhase(this.bossState, this.cursorState);

    if (phase === "playing") {
      return;
    }

    this.ended = true;
    this.input.setDefaultCursor("auto");
    this.boss.setVelocity(0, 0);
    this.fireballs.clear(true, true);
    this.scene.start(SceneKeys.GameOver, { result: phase });
  }

  private drawHud(): void {
    const { width } = this.scale;
    this.drawBar(this.bossHealth, 24, 42, 280, this.bossState.health / this.bossState.maxHealth, 0x68c7b7);
    this.drawBar(
      this.cursorHealth,
      width - 304,
      42,
      280,
      this.cursorState.health / this.cursorState.maxHealth,
      0xf2bd5c
    );
  }

  private drawBar(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    ratio: number,
    color: number
  ): void {
    graphics.clear();
    graphics.fillStyle(0x15161a, 0.9);
    graphics.fillRect(x, y, width, 14);
    graphics.fillStyle(color, 1);
    graphics.fillRect(x, y, width * Phaser.Math.Clamp(ratio, 0, 1), 14);
    graphics.lineStyle(2, 0xf7f2e8, 1);
    graphics.strokeRect(x, y, width, 14);
  }

  private flashTexture(
    sprite: Phaser.GameObjects.Components.Texture,
    flashKey: string,
    defaultKey: string
  ): void {
    sprite.setTexture(flashKey);
    this.time.delayedCall(140, () => sprite.setTexture(defaultKey));
  }

  private spawnImpact(x: number, y: number, textureKey: string): void {
    const impact = this.add.image(x, y, textureKey).setDepth(18).setScale(0.7).setAlpha(0.88);
    this.tweens.add({
      targets: impact,
      alpha: 0,
      scale: 1.4,
      duration: 180,
      onComplete: () => impact.destroy()
    });
  }
}
