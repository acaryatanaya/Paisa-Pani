import { cn } from "@/lib/utils";

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export function FilterChips({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1", className)}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "expense-chip whitespace-nowrap flex-shrink-0",
            activeFilter === filter
              ? "bg-blue-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
