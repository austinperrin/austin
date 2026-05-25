import Phaser from "phaser";
import { SceneKeys } from "./sceneKeys";

interface DesktopBlockedData {
  reason?: "coarse-pointer" | "small-viewport";
}

export class DesktopBlockedScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.DesktopBlocked);
  }

  create(data: DesktopBlockedData): void {
    document.body.dataset.gameScene = "desktop-blocked";
    const { width, height } = this.scale;
    const reason =
      data.reason === "coarse-pointer"
        ? "A mouse or trackpad is required."
        : "A larger desktop viewport is required.";

    this.add.rectangle(0, 0, width, height, 0x15161a).setOrigin(0);
    this.add
      .text(width / 2, height / 2 - 48, "Desktop Required", {
        color: "#f7f2e8",
        fontFamily: "monospace",
        fontSize: "38px"
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height / 2 + 12, reason, {
        align: "center",
        color: "#d4c7b4",
        fontFamily: "monospace",
        fontSize: "18px",
        wordWrap: { width: Math.min(560, width - 48) }
      })
      .setOrigin(0.5);
  }
}
