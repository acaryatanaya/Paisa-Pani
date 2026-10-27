import { Mail, ShieldCheck, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGroup } from "./GroupContext";

interface InviteModalProps { isOpen: boolean; onClose: () => void }

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { getActiveGroupName } = useGroup();
  return <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-[420px]">
      <DialogHeader>
        <DialogTitle>Invite people to {getActiveGroupName()}</DialogTitle>
        <DialogDescription>Secure group invitations are being set up.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3 py-3">
        <div className="flex gap-3 rounded-xl border border-border p-4"><Mail className="mt-0.5 text-emerald-500" size={20} /><div><p className="font-medium">Invite by email</p><p className="mt-1 text-sm text-muted-foreground">Email delivery and invitation acceptance will be enabled after the invitation API is ready.</p></div></div>
        <div className="flex gap-3 rounded-xl bg-muted/50 p-4"><ShieldCheck className="mt-0.5 text-muted-foreground" size={20} /><p className="text-sm text-muted-foreground">We won't show fake invite codes or claim an invitation was sent until the backend can securely create and track it.</p></div>
      </div>
      <Button onClick={onClose} className="w-full"><Users size={16} className="mr-2" />Got it</Button>
    </DialogContent>
  </Dialog>;
}
