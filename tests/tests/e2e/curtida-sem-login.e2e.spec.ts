import { test, expect } from "@playwright/test";


test("Curtir sem autenticação exibe alerta pedindo login", async ({ page }) => {
  let dialogMessage = "";

  page.on("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.dismiss();
  });

  await page.goto("/");

  const likeButton = page.getByRole("button", { name: /curtir/i }).first();
  await expect(likeButton).toBeVisible();
  await likeButton.click();

  await expect.poll(() => dialogMessage).toContain("autenticado");
});