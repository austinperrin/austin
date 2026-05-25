import { expect, test } from "@playwright/test";

test.describe("desktop gate", () => {
  test("blocks mobile-sized coarse pointer devices", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();
    await expect(page.locator("body")).toHaveAttribute("data-game-scene", "desktop-blocked");
  });
});
