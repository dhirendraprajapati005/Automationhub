import { api } from "@/lib/api";

export interface AdminStats {
  userCount: number;
  lessonCount: number;
  machineCount: number;
  downloadCount: number;
  totalFileDownloads: number;
  usersByRole: Record<string, number>;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "moderator" | "admin";
  isEmailVerified: boolean;
  reputationPoints: number;
  createdAt: string;
  lastLoginAt?: string;
}

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const fetchAdminUsers = async (
  page = 1
): Promise<{ users: AdminUser[]; total: number; page: number; pages: number }> => {
  const { data } = await api.get("/admin/users", { params: { page } });
  return data;
};

export const updateUserRole = async (id: string, role: string): Promise<AdminUser> => {
  const { data } = await api.patch(`/admin/users/${id}/role`, { role });
  return data.user;
};
