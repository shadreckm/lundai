import { useState, useCallback } from "react";
import { authApi, type AuthUser, type LoginPayload, type RegisterPayload } from "../services/api.ts";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => authApi.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(payload);
      setUser(res.user);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(payload);
      setUser(res.user);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Registration failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout, isAuthenticated: !!user };
}
