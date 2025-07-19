import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  id: string;
  category: string;
  amount: number;
  paidBy: string;
  comment?: string;
  date: string;
  time: string;
  type: "Personal" | string; // Personal or group name
  emoji: string;
  className?: string;
}

export function ExpenseCard({
  category,
  amount,
  paidBy,
  comment,
  date,
  time,
  type,
  emoji,
  className,
}: ExpenseCardProps) {
  return (
    <div className={cn("expense-card p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-2xl flex-shrink-0">{emoji}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate">
              {category}
            </h3>
            <p className="text-sm text-muted-foreground">Paid by: {paidBy}</p>
            {comment && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {comment}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="font-bold text-lg text-card-foreground">
            ₹{amount.toLocaleString()}
          </span>
          <div className="text-xs text-muted-foreground text-right">
            <div>{date}</div>
            <div>{time}</div>
          </div>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              type === "Personal"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
            )}
          >
            {type}
          </span>
        </div>
      </div>
    </div>
  );
}
