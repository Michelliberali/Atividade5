import { defineConfig, devices } from "@playwright/test";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const API_URL = process.env.API_URL || "http://localhost:8080";

export default defineConfig({
  testDir: "./tests",

  // Execução serial: deixa a gravação do vídeo determinística e evita
  // concorrência no banco durante os testes de cadastro/login.
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: 0,

  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Projeto de API (caixa-preta): bate direto nos endpoints em :8080. Sem navegador.
    {
      name: "api",
      testMatch: "**/api/**/*.spec.ts",
      use: { baseURL: API_URL },
    },

    // Projeto E2E: simula o usuário no navegador (Chromium) em :3000. Grava vídeo.
    {
      name: "e2e",
      testMatch: "**/e2e/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: CLIENT_URL,
        video: "on",
        trace: "on",
      },
    },
  ],
});