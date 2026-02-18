import { useEffect, useState } from "react";
import CamperCard from "@/components/CamperCard";
import { getUsers, updateUser } from "@/lib/api";
import type { User, UserPatch } from "@/types";

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUsers()
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
          setLoadError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to load campers");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (id: number, patch: UserPatch) => {
    setSavingId(id);
    try {
      const updated = await updateUser(id, patch);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? updated : u))
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-10 text-center">
        <p className="text-4xl mb-2">🦕</p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Dino Discovery Camp
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Summer 2026 · Enrolled Campers
        </p>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-16 space-y-4">
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading campers…</p>
        ) : loadError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-destructive font-medium">Could not load campers</p>
            <p className="text-sm text-muted-foreground mt-1">{loadError}</p>
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No campers enrolled yet.</p>
        ) : (
          users.map((user) => (
            <CamperCard
              key={user.id}
              user={user}
              onSave={(patch) => handleSave(user.id, patch)}
              isSaving={savingId === user.id}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Index;
