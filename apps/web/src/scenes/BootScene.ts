import Phaser from "phaser";
import { getDesktopCapability } from "../desktop";
import { SceneKeys } from "./sceneKeys";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    const capability = getDesktopCapability();

    if (!capability.allowed) {
      this.scene.start(SceneKeys.DesktopBlocked, { reason: capability.reason });
      return;
    }

    this.scene.start(SceneKeys.Preload);
  }
}
