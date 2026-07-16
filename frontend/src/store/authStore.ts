import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  loadAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadAuthFromStorage: () => {
    if (typeof window === "undefined") return;

    try {
      const accessToken = localStorage.getItem("access_token");
      const userJson = localStorage.getItem("user");

      if (accessToken && userJson) {
        set({
          user: JSON.parse(userJson),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error("Failed to load auth state:", e);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
