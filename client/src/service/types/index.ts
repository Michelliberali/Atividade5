export interface User {
  id: number;
  email: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
}

// Reações de um post vindas do DummyJSON (curtidas e descurtidas).
export interface Reactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  liked: boolean;
  // Opcional para não quebrar testes/telas que montam um Post sem reactions.
  reactions?: Reactions;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface LikedPostsResponse {
  posts: Post[];
  total: number;
  limit: number;
}