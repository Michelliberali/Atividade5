import { isEmailValid } from "./email";

/**
 * TESTES UNITÁRIOS DE FUNÇÃO SIMPLES (Jest)
 * Função testada: isEmailValid (client/src/utils/email.ts)
 *
 * Obs.: esta é a validação de e-mail do FRONTEND, que está CORRETA.
 * (A validação do BACKEND é que tem o bug — ver UserServiceTest.java.)
 */

describe("isEmailValid (validação de e-mail no frontend)", () => {
  // TESTE DE REGRESSÃO (deve PASSAR)
  test("aceita um e-mail válido", () => {
    expect(isEmailValid("usuario@example.com")).toBe(true);
  });

  // TESTE DE REGRESSÃO (deve PASSAR)
  // "usuario@" não tem domínio -> inválido.
  test("rejeita um e-mail sem domínio", () => {
    expect(isEmailValid("usuario@")).toBe(false);
  });
});
