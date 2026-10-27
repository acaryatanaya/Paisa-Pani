import { useState } from "react";
import { Edit3, LogOut, Moon, Sun, UserPlus } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { GroupSelector } from "@/components/GroupSelector";
import { GroupManagement } from "@/components/GroupManagement";
import { ProfileModal } from "@/components/ProfileModal";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthContext";
import { useGroup } from "@/components/GroupContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const { getActiveGroupName, groups } = useGroup();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
  };

  const handleShareApp = async () => {
    const shareData = {
      title: "Paisa Pani",
      text: "A clearer view of your money with Paisa Pani.",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link Copied!",
          description: "App link copied to clipboard",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not share the app",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-center">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Active Group Selector */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Active Group</h3>
            <GroupSelector compact />
          </div>
          <p className="text-sm text-muted-foreground">
            Currently viewing expenses for{" "}
            <span className="font-medium">{getActiveGroupName()}</span>
          </p>
        </Card>

        {/* Profile Section */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.avatar || user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user?.name || "User"}</h3>
              <p className="text-sm text-muted-foreground">Group Admin</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfileModal(true)}
            >
              <Edit3 size={20} />
            </Button>
          </div>
        </Card>

        {/* Group Management */}
        <Card className="p-4">
          <GroupManagement />
        </Card>

        {/* App Settings */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">App Settings</h3>

          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark theme
                  </p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            </div>

            {/* Share Group Invite */}
            <button
              disabled
              className="flex w-full cursor-not-allowed items-center justify-between rounded-lg p-2 text-left opacity-60"
            >
              <div className="flex items-center gap-3">
                <UserPlus size={20} />
                <div className="text-left">
                  <p className="font-medium">Share Group Invite</p>
                  <p className="text-sm text-muted-foreground">
                    Email invitations will be enabled after backend setup
                  </p>
                </div>
              </div>
            </button>

            {/* Profile Settings */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center justify-between w-full hover:bg-muted/50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Edit3 size={20} />
                <div className="text-left">
                  <p className="font-medium">Account Profile</p>
                  <p className="text-sm text-muted-foreground">
                    View your signed-in account details
                  </p>
                </div>
              </div>
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center justify-between w-full pt-4 border-t hover:bg-muted/50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut size={20} className="text-red-500" />
                <div className="text-left">
                  <p className="font-medium text-red-500">Sign Out</p>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* App Info */}
        <Card className="p-4 text-center">
          <h3 className="font-semibold text-lg mb-2">Paisa Pani</h3>
          <p className="text-sm text-muted-foreground mb-1">
            A clearer view of your money
          </p>
        </Card>
      </div>

      <BottomNavigation />

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
