import type { AssetManifest } from "@poke-the-austin/game-core";
import Phaser from "phaser";
import { SceneKeys, TextureKeys } from "./sceneKeys";

const manifestUrl = "/assets/assets.json";

type ImageSlot = [key: string, url: string | undefined];

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preload);
  }

  preload(): void {
    this.addLoadingText();
    this.load.json("asset-manifest", manifestUrl);
  }

  create(): void {
    const manifest = this.cache.json.get("asset-manifest") as AssetManifest | undefined;

    if (!manifest) {
      this.createFallbackTextures();
      this.scene.start(SceneKeys.Menu);
      return;
    }

    const imageSlots: ImageSlot[] = [
      [TextureKeys.bossIdle, manifest.boss.idle],
      [TextureKeys.bossMove, manifest.boss.move],
      [TextureKeys.bossAttack, manifest.boss.attack],
      [TextureKeys.bossHurt, manifest.boss.hurt],
      [TextureKeys.bossDefeated, manifest.boss.defeated],
      [TextureKeys.cursorNormal, manifest.cursor.normal],
      [TextureKeys.cursorHurt, manifest.cursor.hurt],
      [TextureKeys.cursorDefeated, manifest.cursor.defeated],
      [TextureKeys.swordSlash, manifest.effects.swordSlash],
      [TextureKeys.fireball, manifest.effects.fireball],
      [TextureKeys.hit, manifest.effects.hit],
      [TextureKeys.explosion, manifest.effects.explosion],
      [TextureKeys.arena, manifest.backgrounds.arena]
    ];

    for (const [key, url] of imageSlots) {
      if (url && !this.textures.exists(key)) {
        this.load.image(key, url);
      }
    }

    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.createFallbackTextures();
      this.scene.start(SceneKeys.Menu);
    });

    this.load.start();
  }

  private addLoadingText(): void {
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, "Loading...", {
        color: "#f7f2e8",
        fontFamily: "monospace",
        fontSize: "24px"
      })
      .setOrigin(0.5);
  }

  private createFallbackTextures(): void {
    this.createRectTexture(TextureKeys.bossIdle, 56, 72, 0x68c7b7);
    this.createRectTexture(TextureKeys.bossMove, 56, 72, 0x86d3c7);
    this.createRectTexture(TextureKeys.bossAttack, 64, 72, 0xf2bd5c);
    this.createRectTexture(TextureKeys.bossHurt, 56, 72, 0xff6b6b);
    this.createRectTexture(TextureKeys.bossDefeated, 56, 56, 0x595f6b);
    this.createCircleTexture(TextureKeys.cursorNormal, 18, 0xf7f2e8);
    this.createCircleTexture(TextureKeys.cursorHurt, 18, 0xff8a65);
    this.createCircleTexture(TextureKeys.cursorDefeated, 18, 0x595f6b);
    this.createRectTexture(TextureKeys.swordSlash, 88, 18, 0xf7f2e8);
    this.createCircleTexture(TextureKeys.fireball, 16, 0xff7043);
    this.createCircleTexture(TextureKeys.hit, 18, 0xffd166);
    this.createCircleTexture(TextureKeys.explosion, 28, 0xff6b6b);
  }

  private createRectTexture(key: string, width: number, height: number, color: number): void {
    if (this.textures.exists(key)) {
      return;
    }

    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.lineStyle(3, 0x15161a, 1);
    graphics.strokeRect(1, 1, width - 2, height - 2);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  private createCircleTexture(key: string, radius: number, color: number): void {
    if (this.textures.exists(key)) {
      return;
    }

    const size = radius * 2;
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(color, 1);
    graphics.fillCircle(radius, radius, radius);
    graphics.lineStyle(3, 0x15161a, 1);
    graphics.strokeCircle(radius, radius, radius - 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }
}
