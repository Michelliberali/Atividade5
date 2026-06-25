import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import PostCard from "./PostCard";
import { Post } from "@/service/types";

/**
 * TESTES UNITÁRIOS DE COMPONENTE (Jest + Testing Library)
 * Componente testado: PostCard (client/src/components/PostCard.tsx)
 *
 * O componente é testado de forma ISOLADA: passamos as props
 * manualmente (post, isAuthenticated, onLike) e não dependemos de
 * outras telas, da API ou do contexto de autenticação.
 */

const postFake: Post = {
  id: 1,
  title: "Título de teste",
  body: "Corpo do post de teste",
  liked: false,
};

describe("PostCard (componente isolado)", () => {
  beforeEach(() => {
    // jsdom não implementa alert de verdade, então trocamos por um mock.
    window.alert = jest.fn();
  });

  // TESTE DE REGRESSÃO (deve PASSAR)
  // Requisito: cada post exibe título e corpo.
  test("exibe o título e o corpo do post", () => {
    render(
      <PostCard post={postFake} isAuthenticated={false} onLike={jest.fn()} />
    );

    expect(screen.getByText("Título de teste")).toBeInTheDocument();
    expect(screen.getByText("Corpo do post de teste")).toBeInTheDocument();
  });

  // TESTE DE REGRESSÃO (deve PASSAR)
  // Requisito: usuário deslogado clicando em "Curtir" vê um alert nativo
  // com a mensagem exata, e a curtida NÃO é enviada (onLike não é chamado).
  test("usuário deslogado ao clicar em Curtir vê o alert e não curte", () => {
    const onLike = jest.fn();
    render(
      <PostCard post={postFake} isAuthenticated={false} onLike={onLike} />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();
  });
});
