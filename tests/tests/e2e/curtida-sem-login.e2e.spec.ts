import { test, expect } from "@playwright/test";

/**
 * E2E #3 - Curtir sem estar autenticado.
 *
 * Quando um visitante não logado tenta curtir um post, a aplicação deve
 * exibir um alerta nativo (window.alert) pedindo que ele faça login,
 * em vez de registrar a curtida.
 *
 * Cobre o caso "curtida sem autenticação" citado no enunciado da atividade.
 */
test("Curtir sem autenticação exibe alerta pedindo login", async ({ page }) => {
  let dialogMessage = "";

  // Captura o alerta nativo disparado pela aplicação.
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