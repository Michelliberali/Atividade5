import { isPasswordValid } from "./password";

/**
 * TESTES UNITÁRIOS DE FUNÇÃO SIMPLES (Jest)
 * Função testada: isPasswordValid (client/src/utils/password.ts)
 *
 * Requisito da spec: a senha deve ter no MÍNIMO 8 caracteres,
 * 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.
 */

describe("isPasswordValid (validação de senha no frontend)", () => {
  // TESTE DE REGRESSÃO (deve PASSAR)
  // Uma senha forte com 9 caracteres atende a todos os critérios.
  test("aceita uma senha forte com 9 caracteres", () => {
    expect(isPasswordValid("Senha@123")).toBe(true);
  });

  // TESTE DE REGRESSÃO (deve PASSAR)
  // Sem caractere especial -> deve ser inválida.
  test("rejeita uma senha sem caractere especial", () => {
    expect(isPasswordValid("Senha1234")).toBe(false);
  });

  // 🐞 TESTE DE BUG (deve FALHAR enquanto o bug existir)
  // "Senha@12" tem exatamente 8 caracteres e atende a todos os critérios.
  // Pela spec ("mínimo 8 caracteres") ela DEVERIA ser válida (true).
  // Bug: a função usa `password.length <= 8`, então rejeita o tamanho 8.
  // (O correto seria `password.length < 8`.)
  test("[BUG] deveria aceitar uma senha forte de exatamente 8 caracteres", () => {
    expect(isPasswordValid("Senha@12")).toBe(true);
  });
});
