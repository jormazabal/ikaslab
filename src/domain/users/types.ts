export interface User {
  id: string;
  name: string;
  avatarId: string;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}

export interface CreateUserInput {
  name: string;
  avatarId: string;
}
