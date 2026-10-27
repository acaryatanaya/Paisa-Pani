import { useState } from "react";
import { CalendarDays, Edit3, Plus, Users, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGroup } from "./GroupContext";
import { toast } from "@/hooks/use-toast";

export function GroupManagement() {
  const { groups, activeGroup, getActiveGroupName, addGroup, updateGroup } = useGroup();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState("");
  const group = groups.find((item) => item.id === activeGroup);

  const createGroup = () => {
    const name = window.prompt("Choose a name for your new group")?.trim();
    if (!name) return;
    if (groups.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Group already exists", description: "Choose a different name.", variant: "destructive" });
      return;
    }
    addGroup({ id: crypto.randomUUID?.() ?? Date.now().toString(), name, createdAt: new Date().toISOString() });
    toast({ title: "Group created", description: `${name} is ready to set up.` });
  };

  const saveGroupName = () => {
    const name = editingGroupName.trim();
    if (!group || !name) return;
    updateGroup(group.id, name);
    setIsEditMode(false);
    toast({ title: "Group name updated", description: `Your group is now called ${name}.` });
  };

  if (!groups.length) {
    return <div className="rounded-2xl border border-dashed border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-blue-500/5 p-6 text-center sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-emerald-500/20"><Users size={25} className="text-emerald-500" /></div>
      <h3 className="mt-4 text-lg font-semibold">Your circle starts here</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Create a group for your family, a trip, roommates, or any shared expenses. You can invite people after group management is connected to the backend.</p>
      <Button onClick={createGroup} className="gradient-button mt-5"><Plus size={16} className="mr-2" />Create your first group</Button>
    </div>;
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-emerald-500/20"><Users className="text-emerald-500" size={22} /></div>
        <div className="min-w-0">
          {isEditMode ? <div className="flex gap-2"><Input value={editingGroupName} onChange={(e) => setEditingGroupName(e.target.value)} className="h-9" autoFocus /><Button size="icon" variant="ghost" onClick={saveGroupName}><Check size={16} /></Button><Button size="icon" variant="ghost" onClick={() => setIsEditMode(false)}><X size={16} /></Button></div> : <div className="flex items-center gap-2"><h3 className="truncate text-lg font-semibold">{getActiveGroupName()}</h3><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingGroupName(getActiveGroupName()); setIsEditMode(true); }} aria-label="Rename group"><Edit3 size={14} /></Button></div>}
          <p className="mt-1 text-sm text-muted-foreground">Group workspace</p>
        </div>
      </div>
      <Badge variant="secondary">{groups.length} {groups.length === 1 ? "group" : "groups"}</Badge>
    </div>
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <CalendarDays size={18} className="mt-0.5 text-muted-foreground" />
      <div><p className="text-sm font-medium">{group?.createdAt ? `Created ${new Date(group.createdAt).toLocaleDateString()}` : "Created on this device"}</p><p className="mt-1 text-sm text-muted-foreground">Your group is set up. Member invitations and shared expense permissions will be enabled once the group API is implemented.</p></div>
    </div>
    <div className="rounded-xl border border-dashed border-border p-5 text-center">
      <Users size={22} className="mx-auto text-muted-foreground" />
      <p className="mt-2 font-medium">No members added yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Members will appear here after they accept an invitation.</p>
      <Button variant="outline" className="mt-4" onClick={createGroup}><Plus size={15} className="mr-2" />Create another group</Button>
    </div>
  </div>;
}
