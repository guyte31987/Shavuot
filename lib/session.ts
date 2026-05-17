"use client";

const ID_KEY = "shavuot.id";
const NAME_KEY = "shavuot.name";

export function nameToId(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[\s/\\.#$[\]]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type Session = { id: string; name: string };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem(ID_KEY);
  const name = localStorage.getItem(NAME_KEY);
  if (!id || !name) return null;
  return { id, name };
}

export function signIn(name: string): Session {
  const trimmed = name.trim().replace(/\s+/g, " ");
  const id = nameToId(trimmed);
  localStorage.setItem(ID_KEY, id);
  localStorage.setItem(NAME_KEY, trimmed);
  return { id, name: trimmed };
}

export function signOut() {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(NAME_KEY);
}
