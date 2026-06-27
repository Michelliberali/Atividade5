import { test, expect, request as apiRequest } from "@playwright/test";
import { uniqueEmail, VALID_PASSWORD, API_URL } from "../helpers";


test.describe("Fluxo de login e curtida (autenticado)", () => {
  let email: string;

  test.beforeAll(async () => {
    email = uniqueEmail("e2e_login");
    const ctx = await apiRequest.newContext({ baseURL: API_URL });
    const res = await ctx.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(res.status()).toBe(200);
    await ctx.dispose();
  });

  test("Usuário faz login e curte um post", async ({ page }) => {
    
    await page.goto("/signin");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator("form").getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();

    const likeButton = page.getByRole("button", { name: /curtir/i }).first();
    await expect(likeButton).toBeVisible();
    await likeButton.click();

    await expect(
      page.getByRole("button", { name: /curtido/i }).first()
    ).toBeVisible();
  });
});