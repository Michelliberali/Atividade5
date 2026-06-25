/**
 * Funções e constantes auxiliares usadas pelos testes.
 */

export const API_URL = process.env.API_URL || "http://localhost:8080";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/**
 * Gera um e-mail único a cada execução.
 *
 * Necessário porque o cadastro persiste no MySQL: se reaproveitássemos o mesmo
 * e-mail, o backend devolveria 409 (e-mail já está em uso) na segunda rodada.
 */
export function uniqueEmail(prefix = "e2e"): string {
  const random = Math.floor(Math.random() * 100000);
  return `${prefix}_${Date.now()}_${random}@teste.com`;
}

/**
 * Senha que satisfaz TODAS as regras (backend e frontend):
 * mais de 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.
 */
export const VALID_PASSWORD = "Senha@123";

/**
 * Outra senha válida em FORMATO, porém diferente da correta.
 * Usada para testar credenciais inválidas (401) sem cair na validação 422.
 */
export const WRONG_PASSWORD = "Outra@999";