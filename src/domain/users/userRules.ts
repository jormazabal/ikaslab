import type { CreateUserInput, User } from "./types";

export function normalizeUserName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function validateUserInput(input: CreateUserInput): string[] {
  const errors: string[] = [];
  const name = normalizeUserName(input.name);

  if (name.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.");
  }

  if (name.length > 24) {
    errors.push("El nombre no puede tener más de 24 caracteres.");
  }

  if (!input.avatarId) {
    errors.push("Elige un avatar.");
  }

  return errors;
}

export function createUserEntity(input: CreateUserInput, id: string, now: string): User {
  const errors = validateUserInput(input);
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  return {
    id,
    name: normalizeUserName(input.name),
    avatarId: input.avatarId,
    totalPoints: 0,
    createdAt: now,
    updatedAt: now,
    lastUsedAt: null,
  };
}
