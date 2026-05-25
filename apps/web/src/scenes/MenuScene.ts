import { difficultyOrder } from "@poke-the-austin/game-core";
import Phaser from "phaser";
import { SceneKeys } from "./sceneKeys";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Menu);
  }

  create(): void {
    document.body.dataset.gameScene = "menu";
    const { width, height } = this.scale;
    this.input.setDefaultCursor("auto");
    this.add.rectangle(0, 0, width, height, 0x15161a).setOrigin(0);
    this.add
      .text(width / 2, height * 0.24, "Poke the Austin", {
        color: "#f7f2e8",
        fontFamily: "monospace",
        fontSize: "48px"
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.34, "Choose difficulty", {
        color: "#d4c7b4",
        fontFamily: "monospace",
        fontSize: "20px"
      })
      .setOrigin(0.5);

    difficultyOrder.forEach((difficulty, index) => {
      const button = this.add
        .rectangle(width / 2, height * 0.48 + index * 76, 240, 48, 0x2b2f3a)
        .setStrokeStyle(3, 0xf2bd5c)
        .setInteractive({ useHandCursor: true });

      const label = this.add
        .text(button.x, button.y, difficulty.toUpperCase(), {
          color: "#f7f2e8",
          fontFamily: "monospace",
          fontSize: "22px"
        })
        .setOrigin(0.5);

      button.on(Phaser.Input.Events.POINTER_OVER, () => button.setFillStyle(0x3c4352));
      button.on(Phaser.Input.Events.POINTER_OUT, () => button.setFillStyle(0x2b2f3a));
      button.on(Phaser.Input.Events.POINTER_DOWN, () => {
        label.setColor("#15161a");
        this.scene.start(SceneKeys.Game, { difficulty });
      });
    });
  }
}
