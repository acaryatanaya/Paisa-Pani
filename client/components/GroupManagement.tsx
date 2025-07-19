import React, { useState } from "react";
import { Edit3, Trash2, Plus, Users, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGroup } from "./GroupContext";
import { toast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Member";
  avatar: string;
}

// Sample member data for different groups
const groupMembers: { [key: string]: Member[] } = {
  family: [
    {
      id: "1",
      name: "Tejas",
      email: "tejas@example.com",
      phone: "+91 9876543210",
      role: "Admin",
      avatar: "T",
    },
    {
      id: "2",
      name: "Abhishek",
      email: "abhishek@example.com",
      phone: "+91 9876543211",
      role: "Member",
      avatar: "A",
    },
    {
      id: "3",
      name: "Priyanka",
      email: "priyanka@example.com",
      phone: "+91 9876543212",
      role: "Member",
      avatar: "P",
    },
  ],
  office: [
    {
      id: "1",
      name: "Tejas",
      email: "tejas@example.com",
      phone: "+91 9876543210",
      role: "Admin",
      avatar: "T",
    },
    {
      id: "4",
      name: "Raj",
      email: "raj@office.com",
      phone: "+91 9876543213",
      role: "Member",
      avatar: "R",
    },
    {
      id: "5",
      name: "Sara",
      email: "sara@office.com",
      phone: "+91 9876543214",
      role: "Member",
      avatar: "S",
    },
  ],
};

export function GroupManagement() {
  const { activeGroup, getActiveGroupName } = useGroup();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>(
    groupMembers[activeGroup] || [],
  );

  const groupName = getActiveGroupName();

  const startEditingGroup = () => {
    setIsEditMode(true);
    setEditingGroupName(groupName);
  };

  const saveGroupName = () => {
    if (editingGroupName.trim()) {
      // In a real app, this would update the group name via API
      toast({
        title: "Group Updated",
        description: `Group name changed to "${editingGroupName}"`,
      });
      setIsEditMode(false);
    }
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingGroupName("");
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast({
      title: "Member Removed",
      description: `${memberName} has been removed from the group`,
    });
  };

  const getCreatedDate = () => {
    const dates: { [key: string]: string } = {
      family: "1/1/2024",
      office: "3/15/2024",
    };
    return dates[activeGroup] || "1/1/2024";
  };

  // Update members when active group changes
  React.useEffect(() => {
    setMembers(groupMembers[activeGroup] || []);
    setIsEditMode(false);
  }, [activeGroup]);

  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditMode ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingGroupName}
                onChange={(e) => setEditingGroupName(e.target.value)}
                className="h-8 font-semibold"
                autoFocus
              />
              <Button onClick={saveGroupName} size="sm" variant="ghost">
                <Check size={16} className="text-emerald-600" />
              </Button>
              <Button onClick={cancelEdit} size="sm" variant="ghost">
                <X size={16} className="text-red-500" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-lg">{groupName}</h3>
              <Button
                onClick={startEditingGroup}
                variant="ghost"
                size="sm"
                className="h-8 w-8"
              >
                <Edit3 size={14} />
              </Button>
            </>
          )}
        </div>
        <Badge variant="secondary" className="text-xs">
          <Users size={12} className="mr-1" />
          {members.length} members
        </Badge>
      </div>

      {/* Group Info */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          {members.length} members • Created {getCreatedDate()}
        </p>
        <p>
          Admins: {members.filter((m) => m.role === "Admin").length} • Members:{" "}
          {members.filter((m) => m.role === "Member").length}
        </p>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Group Members</h4>
          <Button variant="outline" size="sm" className="text-xs">
            <Plus size={14} className="mr-1" />
            Add Member
          </Button>
        </div>

        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold">
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{member.name}</span>
                  <Badge
                    variant={member.role === "Admin" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {member.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {member.email}
                </p>
                <p className="text-sm text-muted-foreground">{member.phone}</p>
              </div>
              {member.role !== "Admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 h-8 w-8"
                  onClick={() => handleRemoveMember(member.id, member.name)}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Group Admin Info */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Users size={16} />
          Group Admin
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          As the group admin, you can invite new members and remove existing
          ones. Share the invite code{" "}
          <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
            FAMILY24
          </code>{" "}
          with family members to let them join the group.
        </p>
        <Button variant="outline" size="sm" className="w-full">
          <Plus size={14} className="mr-2" />
          Invite New Member
        </Button>
      </div>
    </div>
  );
}
