import { useState } from "react";
import { ChevronDown, Plus, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGroup } from "./GroupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface GroupSelectorProps { className?: string; compact?: boolean }

export function GroupSelector({ className, compact = false }: GroupSelectorProps) {
  const { groups, activeGroup, setActiveGroup, getActiveGroupName, addGroup } = useGroup();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const createGroup = () => {
    const name = window.prompt("What would you like to name your group?")?.trim();
    if (!name) return;
    if (groups.some((group) => group.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Group already exists", description: "Choose a different name.", variant: "destructive" });
      return;
    }
    addGroup({ id: crypto.randomUUID?.() ?? Date.now().toString(), name, createdAt: new Date().toISOString() });
    setIsOpen(false);
    toast({ title: "Group created", description: `${name} is ready for you to set up.` });
  };

  return (
    <div className={cn("relative", className)}>
      <button onClick={() => setIsOpen(!isOpen)} className={cn("flex items-center gap-2 rounded-xl border border-border bg-card/80 text-sm font-medium shadow-sm transition hover:border-primary/40 hover:bg-muted/50", compact ? "px-3 py-2" : "px-4 py-2.5")}>
        <Users size={16} className="text-emerald-500" />
        <span className="truncate max-w-40">{groups.length ? getActiveGroupName() : "Your groups"}</span>
        <ChevronDown size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && <>
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
        <div className="absolute left-0 top-full z-20 mt-2 flex max-h-96 w-72 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="border-b border-border p-3">
            <p className="font-semibold">Your groups</p>
            <p className="mt-1 text-xs text-muted-foreground">Switch between the groups you manage.</p>
          </div>
          {groups.length > 4 && <div className="p-3"><div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search groups..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-9 pl-9" /></div></div>}
          <div className="flex-1 overflow-y-auto p-1">
            {filteredGroups.map((group) => <button key={group.id} onClick={() => { setActiveGroup(group.id); setIsOpen(false); }} className={cn("flex w-full items-center rounded-xl px-3 py-3 text-left text-sm transition hover:bg-muted", group.id === activeGroup && "bg-emerald-500/10 font-semibold text-emerald-600")}><Users size={16} className="mr-3 shrink-0" /><span className="truncate">{group.name}</span>{group.id === activeGroup && <span className="ml-auto text-xs">Active</span>}</button>)}
            {filteredGroups.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No groups yet. Create one to get started.</p>}
          </div>
          <div className="border-t border-border p-3"><Button onClick={createGroup} className="gradient-button w-full"><Plus size={16} className="mr-2" />Create group</Button></div>
        </div>
      </>}
    </div>
  );
}
