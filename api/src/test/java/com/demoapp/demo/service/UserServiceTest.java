package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

/**
 * TESTES UNITÁRIOS DO BACKEND (JUnit 5)
 * Classe testada: UserService (api/.../service/UserService.java)
 *
 * Os métodos isPasswordValid e isEmailValid não usam o repositório,
 * então podemos criar o service passando null (não precisa de banco
 * nem subir o Spring).
 */
class UserServiceTest {

  private final UserService service = new UserService(null);

  // TESTE DE SUCESSO / REGRESSÃO (deve PASSAR)
  // Senha forte com 9 caracteres atende a todos os critérios.
  @Test
  void senhaForteDeveSerValida() {
    assertTrue(service.isPasswordValid("Senha@123"));
  }

  // TESTE DE SUCESSO / REGRESSÃO (deve PASSAR)
  // Senha fraca (só minúsculas) deve ser recusada.
  @Test
  void senhaFracaDeveSerInvalida() {
    assertFalse(service.isPasswordValid("senha"));
  }

  // 🐞 TESTE DE BUG (deve FALHAR enquanto o bug existir)
  // "usuario@" não é um e-mail válido (não tem domínio).
  // Bug: o backend só verifica se o texto CONTÉM "@", então aceita
  // e-mails inválidos. O esperado correto é que seja inválido (false).
  @Test
  void bug_emailSemDominioDeveriaSerInvalido() {
    assertFalse(service.isEmailValid("usuario@"));
  }
}
