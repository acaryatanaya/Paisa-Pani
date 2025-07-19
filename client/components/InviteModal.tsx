import { useState } from "react";
import { Copy, Share2, Mail, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useGroup } from "./GroupContext";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { getActiveGroupName } = useGroup();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const inviteCode = "FAMILY24";
  const inviteLink = `https://expense-tracker.app/join/${inviteCode}`;
  const groupName = getActiveGroupName();

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy invite code",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy invite link",
        variant: "destructive",
      });
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Join my expense tracking group "${groupName}"! Use invite code: ${inviteCode} or click: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareEmail = () => {
    const subject = `Invitation to join "${groupName}" expense group`;
    const body = `You've been invited to join the "${groupName}" expense tracking group!\n\nInvite Code: ${inviteCode}\nInvite Link: ${inviteLink}\n\nDownload the app and use the invite code to join our group.`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleSendInvite = () => {
    if (!email && !phone) {
      toast({
        title: "Missing Information",
        description: "Please enter email or phone number",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send an actual invite
    toast({
      title: "Invite Sent!",
      description: `Invitation sent to ${email || phone}`,
    });

    setEmail("");
    setPhone("");
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join "${groupName}" expense group`,
          text: `You've been invited to join our expense tracking group!`,
          url: inviteLink,
        });
      } catch (err) {
        // User cancelled or share failed
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Members to {groupName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invite Code Section */}
          <div className="space-y-3">
            <Label>Invite Code</Label>
            <div className="flex gap-2">
              <Input
                value={inviteCode}
                readOnly
                className="font-mono text-lg text-center"
              />
              <Button
                onClick={handleCopyInviteCode}
                variant="outline"
                size="icon"
              >
                <Copy size={16} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this code with family members to let them join the group
            </p>
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-3">
            <Label>Quick Share</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="gap-2"
              >
                <MessageCircle size={16} />
                WhatsApp
              </Button>
              <Button
                onClick={handleWebShare}
                variant="outline"
                className="gap-2"
              >
                <Share2 size={16} />
                Share Link
              </Button>
            </div>
          </div>

          {/* Direct Invite Section */}
          <div className="space-y-3">
            <Label>Send Direct Invite</Label>
            <div className="space-y-3">
              <div>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                or
              </div>
              <div>
                <Input
                  placeholder="Enter phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSendInvite} className="flex-1">
                  Send Invite
                </Button>
                {email && (
                  <Button
                    onClick={handleShareEmail}
                    variant="outline"
                    size="icon"
                  >
                    <Mail size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">How to join:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Download the Family Expense Tracker app</li>
              <li>
                2. Enter the invite code:{" "}
                <code className="bg-muted px-1 rounded">{inviteCode}</code>
              </li>
              <li>3. Start tracking expenses together!</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
