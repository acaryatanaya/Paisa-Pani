import { useState, useMemo } from "react";
import { Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ExpenseCard } from "@/components/ExpenseCard";
import { FilterChips } from "@/components/FilterChips";
import { GroupSelector } from "@/components/GroupSelector";
import { useGroup } from "@/components/GroupContext";
import { useExpense } from "@/components/ExpenseContext";
import { useAuth } from "@/components/AuthContext";

const categoryFilters = [
  "All",
  "Entertainment",
  "Food",
  "Grocery",
  "Health",
  "Home Essentials",
  "Shopping",
  "Travel",
  "Transport",
  "Others",
];

export default function Home() {
  const navigate = useNavigate();
  const { activeGroup, getActiveGroupName, groups } = useGroup();
  const { user } = useAuth();
  const {
    getExpensesByGroup,
    getTotalSpending,
    getExpensesByCategory,
    getExpensesByType,
  } = useExpense();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const currentGroupName = getActiveGroupName();
  const typeFilters = groups.length ? ["All", "Personal", currentGroupName] : ["All", "Personal"];

  const groupExpenses = useMemo(
    () => activeGroup ? getExpensesByGroup(activeGroup) : getExpensesByGroup(""),
    [activeGroup, getExpensesByGroup],
  );
  const totalSpending = useMemo(
    () => getTotalSpending(activeGroup || undefined),
    [activeGroup, getTotalSpending],
  );

  const filteredExpenses = useMemo(() => {
    let expenses = groupExpenses;

    if (categoryFilter !== "All") {
      expenses = expenses.filter(
        (expense) => expense.category === categoryFilter,
      );
    }

    if (typeFilter !== "All") {
      expenses = expenses.filter((expense) => expense.type === typeFilter);
    }

    return expenses;
  }, [groupExpenses, categoryFilter, typeFilter]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-blue-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/15">
            <User size={20} className="text-white" />
          </div>

          <div className="text-center">
            <h1 className="text-lg font-semibold">Hey {user?.name?.split(" ")[0] || "there"}</h1>
            <p className="text-xs text-muted-foreground">A clearer view of your money</p>
          </div>

          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Group selector only appears after the user creates or joins a group */}
        <GroupSelector />
        {groups.length === 0 && <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-transparent p-4">
          <p className="font-semibold">Your money, made clearer.</p>
          <p className="mt-1 text-sm text-muted-foreground">Track personal spending now, or create a group when you are ready to share expenses.</p>
        </div>}

        {/* Category Filters */}
        <div>
          <FilterChips
            filters={categoryFilters}
            activeFilter={categoryFilter}
            onFilterChange={setCategoryFilter}
          />
        </div>

        {/* Type Filters */}
        <div>
          <FilterChips
            filters={typeFilters}
            activeFilter={typeFilter}
            onFilterChange={setTypeFilter}
          />
        </div>

        {/* Total Spending Card */}
        <div className="expense-card p-6 bg-gradient-to-br from-card via-card to-emerald-500/5">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-1">Total Spending</p>
            <h2 className="text-3xl font-bold mb-1 text-card-foreground">
              ₹{totalSpending.toLocaleString()}
            </h2>
            <p className="text-muted-foreground text-sm">
              {filteredExpenses.length} transactions
            </p>
          </div>
        </div>

        {/* Expense Cards */}
        <div className="space-y-3">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                {...expense}
                date={formatDate(expense.date)}
                time={formatTime(expense.time)}
                className="animate-fade-in"
              />
            ))
          ) : (
            <div className="expense-card p-8 sm:p-10 text-center border-dashed bg-gradient-to-b from-card to-muted/30">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-emerald-500/20 text-2xl">₹</div>
              <h3 className="font-semibold text-lg">Your money story starts here</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">You do not have any expenses to show yet. Add your first expense to start seeing your spending clearly.</p>
              <button onClick={() => navigate("/add-expense")} className="gradient-button mt-5 rounded-xl px-5 py-2.5 text-sm">Add your first expense</button>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
