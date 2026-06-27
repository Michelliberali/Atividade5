import { defineConfig, devices } from "@playwright/test";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const API_URL = process.env.API_URL || "http://localhost:8080";

// No ambiente de CI a máquina é mais lenta, então damos mais tempo e
// permitimos algumas tentativas para evitar falhas por instabilidade.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,
  workers: 1,

  // Tempo máximo por teste (maior no CI).
  timeout: isCI ? 60_000 : 30_000,

  forbidOnly: isCI,
  retries: isCI ? 2 : 0,

  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Espera padrão por ações/navegação (maior no CI).
    actionTimeout: isCI ? 15_000 : 0,
    navigationTimeout: isCI ? 30_000 : 0,
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