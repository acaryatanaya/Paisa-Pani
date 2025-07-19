import { Home, Plus, BarChart3, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Plus, label: "Add Expense", path: "/add-expense" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1",
                isActive
                  ? "text-expense-coral"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
