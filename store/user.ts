"use client";

import { create } from "zustand";

type LocalUser = {
  id: string;
  name: string;
};

function getOrCreateLocalUser(): LocalUser {
  if (typeof window === "undefined") return { id: "server", name: "Server" };
  const raw = localStorage.getItem("local-user");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  const id = Math.random().toString(36).slice(2, 10);
  const name = `Guest-${id.slice(0, 4)}`;
  const user = { id, name };
  localStorage.setItem("local-user", JSON.stringify(user));
  return user;
}

export type UserState = {
  user: LocalUser;
  setName: (name: string) => void;
  reset: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: getOrCreateLocalUser(),
  setName: (name) => {
    set((state) => {
      const next = { ...state.user, name };
      if (typeof window !== "undefined") {
        localStorage.setItem("local-user", JSON.stringify(next));
      }
      return { user: next }; // ✅ fixed line
    });
  },
  reset: () => {
    if (typeof window !== "undefined") localStorage.removeItem("local-user");
    set({ user: getOrCreateLocalUser() });
  },
}));
