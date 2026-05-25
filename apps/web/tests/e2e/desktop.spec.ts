import { expect, test } from "@playwright/test";

test.describe("desktop gameplay shell", () => {
  test("loads the desktop menu", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();
    await expect(page).toHaveTitle("Poke the Austin");
    await expect(page.locator("body")).toHaveAttribute("data-game-scene", "menu");
  });

  test("starts each difficulty from the menu", async ({ page }) => {
    for (const y of [346, 422, 498]) {
      await page.goto("/");
      await expect(page.locator("body")).toHaveAttribute("data-game-scene", "menu");
      await page.mouse.click(640, y);
      await expect(page.locator("body")).toHaveAttribute("data-game-scene", "game");
      await expect(page.locator("canvas")).toBeVisible();
    }
  });
});
