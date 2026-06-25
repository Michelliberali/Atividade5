import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./page";
import { AuthProvider } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

/**
 * TESTE DE INTEGRAÇÃO (Jest + Testing Library)
 * Tela testada: /signin (client/src/app/signin/page.tsx)
 *
 * Aqui vários componentes trabalham juntos (Header + Input + Button +
 * contexto de autenticação + serviço). Simulamos (mock) o roteador do
 * Next e o authService para não chamar a API real.
 *
 * Requisito: após login bem-sucedido, o usuário é autenticado e
 * redirecionado para a página principal ("/").
 */

// Mock do roteador do Next.js (precisa começar com "mock" por regra do Jest).
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock do serviço de autenticação (não bate na API real).
jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

describe("Tela de Login (integração)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // TESTE DE REGRESSÃO (deve PASSAR)
  test("login com credenciais válidas autentica e redireciona para '/'", async () => {
    (authService.signIn as jest.Mock).mockResolvedValue({
      id: 1,
      email: "usuario@example.com",
    });

    const { container } = render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    // Preenche o e-mail (placeholder é único na tela).
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@example.com" },
    });

    // Preenche a senha (único input do tipo password nesta tela).
    const passwordInput = container.querySelector(
      'input[type="password"]'
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Senha@123" } });

    // Clica no botão de envio do formulário (type="submit").
    const submit = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    fireEvent.click(submit);

    // O serviço deve ter sido chamado com os dados digitados...
    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith({
        email: "usuario@example.com",
        password: "Senha@123",
      });
    });

    // ...e o usuário deve ser redirecionado para a raiz "/".
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
