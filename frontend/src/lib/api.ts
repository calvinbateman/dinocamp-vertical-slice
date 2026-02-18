import type { User, UserPatch } from "@/types";

const API_BASE = "/api";

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error(`Failed to load users: ${res.status}`);
  return res.json();
}

export async function updateUser(
  id: number,
  patch: UserPatch
): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data?.error ?? `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}
