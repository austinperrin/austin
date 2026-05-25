import Phaser from "phaser";
import { SceneKeys } from "./sceneKeys";

interface GameOverData {
  result: "won" | "lost";
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver);
  }

  create(data: GameOverData): void {
    document.body.dataset.gameScene = "game-over";
    const { width, height } = this.scale;
    const won = data.result === "won";
    this.input.setDefaultCursor("auto");

    this.add.rectangle(0, 0, width, height, won ? 0x17352f : 0x351b22).setOrigin(0);
    this.add
      .text(width / 2, height * 0.36, won ? "Austin Defeated" : "Cursor Defeated", {
        color: "#f7f2e8",
        fontFamily: "monospace",
        fontSize: "44px"
      })
      .setOrigin(0.5);

    const button = this.add
      .rectangle(width / 2, height * 0.54, 230, 52, 0xf2bd5c)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(button.x, button.y, "PLAY AGAIN", {
        color: "#15161a",
        fontFamily: "monospace",
        fontSize: "22px"
      })
      .setOrigin(0.5);

    button.on(Phaser.Input.Events.POINTER_DOWN, () => this.scene.start(SceneKeys.Menu));
  }
}
