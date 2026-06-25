import { test, expect } from "@playwright/test";
import { uniqueEmail, VALID_PASSWORD } from "../helpers";


test("Fluxo de cadastro: novo usuário se registra e fica autenticado", async ({
  page,
}) => {
  const email = uniqueEmail("e2e_cadastro");

  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "Criar Conta" })).toBeVisible();

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').nth(0).fill(VALID_PASSWORD); 
  await page.locator('input[type="password"]').nth(1).fill(VALID_PASSWORD); 

  await page.locator("form").getByRole("button", { name: "Criar Conta" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
});