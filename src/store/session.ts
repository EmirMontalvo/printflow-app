// PrintFlow AI — session.ts
// Store de Zustand para sesión y conexión.
// Constitution Principle I: el candado consume este store.

import { create } from "zustand";
import type { SessionDTO } from "../data/contracts";

interface SessionState {
  session: SessionDTO | null;
  isOnline: boolean;
  login: (session: SessionDTO) => void;
  logout: () => void;
  setOnline: (online: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isOnline: navigator.onLine,
  login: (session) => set({ session }),
  logout: () => set({ session: null }),
  setOnline: (online) => set({ isOnline: online }),
}));

// Listeners para online/offline
if (typeof window !== "undefined") {
  window.addEventListener("online", () => useSessionStore.getState().setOnline(true));
  window.addEventListener("offline", () => useSessionStore.getState().setOnline(false));
}
