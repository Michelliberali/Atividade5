import { test, expect } from "@playwright/test";
import { uniqueEmail, VALID_PASSWORD, WRONG_PASSWORD } from "../helpers";

/**
 * Testes de API (caixa-preta).
 *
 * Validam o comportamento dos endpoints com entradas conhecidas, observando
 * apenas o que entra (request) e o que sai (status + corpo da resposta),
 * sem olhar a implementação interna.
 *
 * O baseURL aqui é a API (http://localhost:8080), definido no projeto "api".
 */
test.describe("API - Autenticação e Posts (caixa-preta)", () => {
  // 1) Cadastro com sucesso
  test("POST /auth/signup cria um usuário e retorna 200", async ({ request }) => {
    const email = uniqueEmail("signup_ok");

    const res = await request.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.email).toBe(email);
    expect(typeof body.id).toBe("number");
  });

  // 2) Cadastro com e-mail duplicado
  test("POST /auth/signup com e-mail duplicado retorna 409", async ({ request }) => {
    const email = uniqueEmail("dup");

    const first = await request.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(first.status()).toBe(200);

    const second = await request.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(second.status()).toBe(409);

    const body = await second.json();
    expect(body.message).toContain("já está em uso");
  });

  // 3) Cadastro com senha fraca (regra de validação)
  test("POST /auth/signup com senha inválida retorna 422", async ({ request }) => {
    const res = await request.post("/auth/signup", {
      data: { email: uniqueEmail("weak"), password: "123" },
    });

    expect(res.status()).toBe(422);

    const body = await res.json();
    expect(body.message).toBe("Senha inválida");
  });

  // 4) Login com sucesso
  test("POST /auth/signin com credenciais válidas retorna 200", async ({ request }) => {
    const email = uniqueEmail("signin_ok");

    // pré-condição: o usuário precisa existir
    const created = await request.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(created.status()).toBe(200);

    const res = await request.post("/auth/signin", {
      data: { email, password: VALID_PASSWORD },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.email).toBe(email);
  });

  // 5) Login com senha incorreta
  test("POST /auth/signin com senha incorreta retorna 401", async ({ request }) => {
    const email = uniqueEmail("signin_bad");

    const created = await request.post("/auth/signup", {
      data: { email, password: VALID_PASSWORD },
    });
    expect(created.status()).toBe(200);

    const res = await request.post("/auth/signin", {
      data: { email, password: WRONG_PASSWORD },
    });

    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body.message).toContain("Credenciais inválidas");
  });

  // 6) Listagem de posts (paginada)
  test("GET /posts retorna lista paginada com sucesso (200)", async ({ request }) => {
    const res = await request.get("/posts", {
      params: { limit: 5, skip: 0 },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeLessThanOrEqual(5);
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("skip");
    expect(body).toHaveProperty("limit");
  });
});