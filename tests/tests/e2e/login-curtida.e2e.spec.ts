import { test, expect, request as apiRequest } from "@playwright/test";
import { uniqueEmail, VALID_PASSWORD, API_URL } from "../helpers";

/**
 * E2E #2 - Fluxo de login + curtida (usuário autenticado).
 *
 * 1. Um usuário é criado via API (pré-condição), garantindo que ele exista.
 * 2. O teste faz o login pela interface (formulário em /signin).
 * 3. Já autenticado na home, curte o primeiro post e verifica que o botão
 *    muda de "Curtir" para "Curtido".
 */
test.describe("Fluxo de login e curtida (autenticado)", () => {
  let email: string;

  test.beforeAll(async () => {
    // Cria o usuário direto na API antes de testar o login pela UI.
    email = uniqueEmail("e2e_login");
    const ctx = await apiRequest.newContext({ baseURL: API_URL });
    const res = await ctx.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(res.status()).toBe(200);
    await ctx.dispose();
  });

  test("Usuário faz login e curte um post", async ({ page }) => {
    // --- Login pela interface ---
    await page.goto("/signin");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator("form").getByRole("button", { name: "Entrar" }).click();

    // Login OK -> home autenticada.
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();

    // --- Curtir o primeiro post ---
    const likeButton = page.getByRole("button", { name: /curtir/i }).first();
    await expect(likeButton).toBeVisible();
    await likeButton.click();

    // O botão passa a indicar "Curtido".
    await expect(
      page.getByRole("button", { name: /curtido/i }).first()
    ).toBeVisible();
  });
});