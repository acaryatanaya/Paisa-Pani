import { UserRound, Mail, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";

interface ProfileModalProps { isOpen: boolean; onClose: () => void }

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const displayName = user?.name || "Your profile";
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

  return <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-[440px]">
      <DialogHeader><DialogTitle>Account profile</DialogTitle><DialogDescription>Your details from the account you used to sign in.</DialogDescription></DialogHeader>
      <div className="py-4">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-500/10 via-card to-emerald-500/10 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-emerald-400 text-2xl font-bold text-white shadow-lg shadow-emerald-500/15">{initials}</div>
          <h3 className="mt-4 text-xl font-semibold">{displayName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Paisa Pani account</p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-border p-3"><UserRound size={18} className="text-emerald-500" /><div className="min-w-0"><p className="text-xs text-muted-foreground">Display name</p><p className="truncate text-sm font-medium">{displayName}</p></div></div>
          <div className="flex items-center gap-3 rounded-xl border border-border p-3"><Mail size={18} className="text-emerald-500" /><div className="min-w-0"><p className="text-xs text-muted-foreground">Email address</p><p className="truncate text-sm font-medium">{user?.email || "Not available"}</p></div></div>
          <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-3"><ShieldCheck size={18} className="mt-0.5 text-muted-foreground" /><p className="text-sm text-muted-foreground">Profile editing will be enabled when we connect the profile API, so changes are saved securely to your account rather than only on this browser.</p></div>
        </div>
      </div>
      <Button onClick={onClose} className="w-full">Done</Button>
    </DialogContent>
  </Dialog>;
}
