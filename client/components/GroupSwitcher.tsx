import { useState } from "react";
import { ChevronDown, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
}

interface GroupSwitcherProps {
  groups: Group[];
  activeGroup: string;
  onGroupChange: (groupId: string) => void;
  className?: string;
}

export function GroupSwitcher({
  groups,
  activeGroup,
  onGroupChange,
  className,
}: GroupSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentGroup = groups.find((g) => g.id === activeGroup);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        <span>{currentGroup?.name || "Select Group"}</span>
        <ChevronDown
          size={16}
          className={cn(
            "transition-transform duration-200",
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
          <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-20">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => {
                    onGroupChange(group.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex-1 text-left text-sm",
                    group.id === activeGroup && "font-semibold text-blue-600",
                  )}
                >
                  {group.name}
                </button>
                <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                  <Edit3 size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
