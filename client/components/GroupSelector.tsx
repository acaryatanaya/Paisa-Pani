import { useState } from "react";
import { ChevronDown, Edit3, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGroup } from "./GroupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GroupSelectorProps {
  className?: string;
  compact?: boolean;
}

export function GroupSelector({
  className,
  compact = false,
}: GroupSelectorProps) {
  const { groups, activeGroup, setActiveGroup, getActiveGroupName } =
    useGroup();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleGroupSelect = (groupId: string) => {
    setActiveGroup(groupId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 bg-card rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors",
          compact ? "px-2 py-1" : "px-3 py-2",
        )}
      >
        <span className="truncate max-w-32">{getActiveGroupName()}</span>
        <ChevronDown
          size={16}
          className={cn(
            "transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-hidden flex flex-col">
            {/* Search bar for many groups */}
            {groups.length > 5 && (
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-8"
                  />
                </div>
              </div>
            )}

            {/* Groups list */}
            <div className="flex-1 overflow-y-auto">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                >
                  <button
                    onClick={() => handleGroupSelect(group.id)}
                    className={cn(
                      "flex-1 text-left text-sm truncate",
                      group.id === activeGroup && "font-semibold text-blue-600",
                    )}
                  >
                    {group.name}
                  </button>
                  <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground flex-shrink-0">
                    <Edit3 size={14} />
                  </button>
                </div>
              ))}

              {filteredGroups.length === 0 && searchTerm && (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  No groups found
                </div>
              )}
            </div>

            {/* Add new group button - only show in home page selector */}
            {!compact && (
              <div className="p-3 border-t border-border">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add New Group
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
