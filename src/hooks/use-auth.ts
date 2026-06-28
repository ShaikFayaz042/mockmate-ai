import { useEffect, useState, useCallback } from "react";

const KEY = "mm_auth";

export type FakeUser = { name: string; email: string };

function read(): FakeUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FakeUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<FakeUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(read());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setUser(read());
    };
    const onCustom = () => setUser(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("mm-auth-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("mm-auth-change", onCustom);
    };
  }, []);

  const login = useCallback((u: FakeUser) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    window.dispatchEvent(new Event("mm-auth-change"));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("mm-auth-change"));
    setUser(null);
  }, []);

  return { user, hydrated, isAuthed: !!user, login, logout };
}
