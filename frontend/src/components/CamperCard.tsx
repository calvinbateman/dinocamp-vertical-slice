import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";
import type { User, UserPatch } from "@/types";

/** Email local part (before @) for display as @handle */
function emailHandle(email: string): string {
  const i = email.indexOf("@");
  return i === -1 ? email : email.slice(0, i);
}

interface CamperCardProps {
  user: User;
  onSave: (patch: UserPatch) => Promise<void>;
  isSaving?: boolean;
}

const CamperCard = ({ user, onSave, isSaving = false }: CamperCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draftHandle, setDraftHandle] = useState(() => emailHandle(user.email));
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) setDraftHandle(emailHandle(user.email));
  }, [user.email, editing]);

  const handleSave = async () => {
    setError(null);
    const trimmed = (draftHandle ?? "").trim();
    const at = user.email.indexOf("@");
    const domain = at === -1 ? "example.com" : user.email.slice(at);
    const newEmail = trimmed.includes("@") ? trimmed : trimmed + domain;
    try {
      await onSave({ email: newEmail });
      setEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      setDraftHandle(emailHandle(user.email));
    }
  };

  const handleCancel = () => {
    setDraftHandle(emailHandle(user.email));
    setError(null);
    setEditing(false);
  };

  const displayName = `${user.first_name} ${user.last_name}`.trim() || "—";
  const handleDisplay = emailHandle(user.email);

  return (
    <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl" aria-hidden>🦕</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-foreground">{displayName}</h3>

            {editing ? (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={draftHandle}
                  onChange={(e) => setDraftHandle(e.target.value)}
                  className="h-9 text-sm"
                  placeholder="username"
                  autoFocus
                />
                <Button size="sm" onClick={handleSave} disabled={isSaving} className="shrink-0">
                  <Check className="h-4 w-4 mr-1" /> {isSaving ? "Saving…" : "Save"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSaving} className="shrink-0">
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-3">
                <span className="text-muted-foreground text-sm font-medium">@{handleDisplay}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setDraftHandle(emailHandle(user.email));
                    setError(null);
                    setEditing(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit Username
                </Button>
              </div>
            )}

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 bg-success text-success-foreground py-2 text-sm font-semibold transition-all duration-300 ${
            showSuccess ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <Check className="h-4 w-4" /> Username updated!
        </div>
      </CardContent>
    </Card>
  );
};

export default CamperCard;
