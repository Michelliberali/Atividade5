import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./page";
import { AuthProvider } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

function getInputByLabel(labelText: string): HTMLInputElement {
  const label = screen.getByText(labelText);
  const input = label.parentElement?.querySelector("input");
  if (!input) {
    throw new Error(`Não encontrei o input do campo "${labelText}"`);
  }
  return input as HTMLInputElement;
}

describe("Tela de Cadastro (integração)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("cadastro válido autentica e redireciona para '/'", async () => {
    (authService.signUp as jest.Mock).mockResolvedValue({
      id: 1,
      email: "novo@example.com",
    });

    const { container } = render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    fireEvent.change(getInputByLabel("Email"), {
      target: { value: "novo@example.com" },
    });
    fireEvent.change(getInputByLabel("Senha"), {
      target: { value: "Senha@123" },
    });
    fireEvent.change(getInputByLabel("Confirmar Senha"), {
      target: { value: "Senha@123" },
    });

    const submit = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    fireEvent.click(submit);

    await waitFor(() => {
      expect(authService.signUp).toHaveBeenCalledWith({
        email: "novo@example.com",
        password: "Senha@123",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});