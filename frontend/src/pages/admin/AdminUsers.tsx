import { useEffect, useState } from "react";
import { fetchAdminUsers, updateUserRole, type AdminUser } from "@/lib/admin-api";
import { useAuth } from "@/context/AuthContext";

const ROLES = ["user", "moderator", "admin"] as const;

export const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    fetchAdminUsers()
      .then((data) => setUsers(data.users))
      .catch(() => setError("Couldn't load users."))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (id: string, role: string) => {
    setUpdatingId(id);
    setError(null);
    try {
      const updated = await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: updated.role } : u)));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-ink-400">
        Manage roles here. There is no public way for a user to become an admin or moderator — this screen is the
        only path, aside from the initial <code className="font-mono text-xs">npm run seed:admin</code> bootstrap.
      </p>

      {error && <p className="mt-4 text-red-400">{error}</p>}
      {isLoading && <p className="mt-6 text-ink-400">Loading users...</p>}

      {!isLoading && (
        <div className="mt-6 overflow-x-auto panel-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-panel-700 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Verified</th>
                <th className="pb-3 pr-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-panel-800 last:border-0">
                  <td className="py-3 pr-4">
                    {u.name} {u._id === currentUser?.id && <span className="text-xs text-ink-400">(you)</span>}
                  </td>
                  <td className="py-3 pr-4 text-ink-400">{u.email}</td>
                  <td className="py-3 pr-4">{u.isEmailVerified ? "Yes" : "No"}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={u.role}
                      disabled={updatingId === u._id}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 px-2 py-1 text-sm focus:border-signal-500 focus:outline-none disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
