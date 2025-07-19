import { useState, useMemo } from "react";
import { Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ExpenseCard } from "@/components/ExpenseCard";
import { FilterChips } from "@/components/FilterChips";
import { GroupSelector } from "@/components/GroupSelector";
import { useGroup } from "@/components/GroupContext";
import { useExpense } from "@/components/ExpenseContext";

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
  const { activeGroup, getActiveGroupName } = useGroup();
  const {
    getExpensesByGroup,
    getTotalSpending,
    getExpensesByCategory,
    getExpensesByType,
  } = useExpense();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const currentGroupName = getActiveGroupName();
  const typeFilters = ["All", "Personal", currentGroupName];

  const groupExpenses = useMemo(
    () => getExpensesByGroup(activeGroup),
    [activeGroup, getExpensesByGroup],
  );
  const totalSpending = useMemo(
    () => getTotalSpending(activeGroup),
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>

          <div className="text-center">
            <h1 className="text-lg font-semibold">Hey Tejas</h1>
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
        {/* Group Selector */}
        <GroupSelector />

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
        <div className="expense-card p-6">
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
            <div className="expense-card p-8 text-center">
              <p className="text-muted-foreground">No expenses found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or add a new expense
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
