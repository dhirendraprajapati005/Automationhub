import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setAccessToken } from "@/lib/api";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ userId: string }>;
  verifyOTP: (userId: string, otp: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try to exchange the httpOnly refresh cookie for a fresh
  // access token so the user stays logged in across page reloads.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        const me = await api.get("/auth/me");
        setUser(me.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    return { userId: data.userId };
  };

  const verifyOTP = async (userId: string, otp: string) => {
    const { data } = await api.post("/auth/verify-otp", { userId, otp });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const loginWithGoogle = async (idToken: string) => {
    const { data } = await api.post("/auth/google", { idToken });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, verifyOTP, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
