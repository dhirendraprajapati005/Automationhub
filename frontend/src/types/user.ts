export type UserRole = "user" | "moderator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isEmailVerified: boolean;
  reputationPoints: number;
  createdAt: string;
}
