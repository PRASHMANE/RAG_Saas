import { create } from "zustand";

import type { User } from "../types/auth";

type AuthStore = {
  user: User | null;

  setUser: (user: User | null) => void;

  logout: () => void;
};

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    logout: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      set({ user: null });

      window.location.href = "/";
    },
  }));