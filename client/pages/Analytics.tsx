import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { FilterChips } from "@/components/FilterChips";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernPieChart } from "@/components/ModernPieChart";
import { BarChart } from "@/components/BarChart";
import { useGroup } from "@/components/GroupContext";
import { useExpense } from "@/components/ExpenseContext";

const timeFilters = ["Month", "Year", "Custom"];

export default function Analytics() {
  const { activeGroup, getActiveGroupName, groups } = useGroup();
  const { getExpensesByGroup, getTotalSpending } = useExpense();
  const [timeFilter, setTimeFilter] = useState("Month");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });

  const currentGroupName = getActiveGroupName();
  const expenseTypeFilters = groups.length ? ["All", "Personal", currentGroupName] : ["All", "Personal"];

  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter);
    setShowCustomRange(filter === "Custom");
  };

  const groupExpenses = useMemo(
    () => activeGroup ? getExpensesByGroup(activeGroup) : getExpensesByGroup(""),
    [activeGroup, getExpensesByGroup],
  );
  const totalSpending = useMemo(
    () => getTotalSpending(activeGroup || undefined),
    [activeGroup, getTotalSpending],
  );

  const averagePerTransaction =
    groupExpenses.length > 0
      ? Math.round(totalSpending / groupExpenses.length)
      : 0;

  // Chart data calculations
  const categoryChartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    groupExpenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const colors = [
      "#4F8DFF",
      "#39D98A",
      "#FF6B6B",
      "#FFD93D",
      "#8B5CF6",
      "#F59E0B",
      "#EF4444",
      "#10B981",
      "#3B82F6",
      "#6366F1",
    ];

    return Array.from(categoryMap.entries()).map(
      ([category, amount], index) => ({
        name: category,
        value: amount,
        color: colors[index % colors.length],
      }),
    );
  }, [groupExpenses]);

  const memberChartData = useMemo(() => {
    const memberMap = new Map<string, number>();
    groupExpenses.forEach((expense) => {
      const current = memberMap.get(expense.paidBy) || 0;
      memberMap.set(expense.paidBy, current + expense.amount);
    });

    const colors = ["#4F8DFF", "#39D98A", "#FF6B6B", "#FFD93D", "#8B5CF6"];

    return Array.from(memberMap.entries()).map(([member, amount], index) => ({
      name: member,
      value: amount,
      color: colors[index % colors.length],
    }));
  }, [groupExpenses]);

  const monthlyBarData = useMemo(() => {
    const monthMap = new Map<string, Map<string, number>>();

    groupExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthMap.has(monthYear)) {
        monthMap.set(monthYear, new Map());
      }

      const categoryMap = monthMap.get(monthYear)!;
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    // Get the last 6 months of data
    const sortedMonths = Array.from(monthMap.keys()).slice(-6);
    const allCategories = [...new Set(groupExpenses.map((e) => e.category))];

    return sortedMonths.map((month) => {
      const total = Array.from(monthMap.get(month)?.values() || []).reduce(
        (sum, val) => sum + val,
        0,
      );
      return {
        name: month,
        value: total,
        color: "#4F8DFF",
      };
    });
  }, [groupExpenses]);

  const memberBarData = useMemo(() => {
    const memberMap = new Map<string, number>();
    groupExpenses.forEach((expense) => {
      const current = memberMap.get(expense.paidBy) || 0;
      memberMap.set(expense.paidBy, current + expense.amount);
    });

    const colors = ["#4F8DFF", "#39D98A", "#FF6B6B"];
    return Array.from(memberMap.entries()).map(([member, amount], index) => ({
      name: member,
      value: amount,
      color: colors[index % colors.length],
    }));
  }, [groupExpenses]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-center">Analytics</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Time Period Filter */}
        <div>
          <h3 className="text-sm font-medium mb-3">Time Period</h3>
          <FilterChips
            filters={timeFilters}
            activeFilter={timeFilter}
            onFilterChange={handleTimeFilterChange}
          />

          {/* Custom Date Range */}
          {showCustomRange && (
            <Card className="mt-3 p-4">
              <Label className="text-sm font-medium mb-3 block">
                Custom Date Range
              </Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label
                    htmlFor="startDate"
                    className="text-xs text-muted-foreground"
                  >
                    From
                  </Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      value={customRange.startDate}
                      onChange={(e) =>
                        setCustomRange((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="h-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="endDate"
                    className="text-xs text-muted-foreground"
                  >
                    To
                  </Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      value={customRange.endDate}
                      onChange={(e) =>
                        setCustomRange((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="h-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600 pointer-events-none" />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Expense Type Filter */}
        <div>
          <h3 className="text-sm font-medium mb-3">Expense Type</h3>
          <FilterChips
            filters={expenseTypeFilters}
            activeFilter={typeFilter}
            onFilterChange={setTypeFilter}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">
              -₹{(totalSpending / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-muted-foreground">Total Spending</div>
            <div className="text-xs text-muted-foreground">
              {currentGroupName}
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {groupExpenses.length}
            </div>
            <div className="text-xs text-muted-foreground">Transactions</div>
            <div className="text-xs text-muted-foreground">
              This {timeFilter.toLowerCase()}
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-500 mb-1">
              ₹{averagePerTransaction.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Average per Transaction
            </div>
            <div className="text-xs text-muted-foreground">
              {currentGroupName}
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Modern Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <ModernPieChart
                data={categoryChartData}
                size={240}
                title="Expense by Category"
                className="w-full"
              />
            </Card>

            <Card className="p-6">
              <ModernPieChart
                data={memberChartData}
                size={240}
                title="Expense by Member"
                className="w-full"
              />
            </Card>
          </div>

          {/* Bar Charts */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">
              {timeFilter === "Month"
                ? "Monthly"
                : timeFilter === "Year"
                  ? "Yearly"
                  : "Period"}{" "}
              Expenses Trend
            </h3>
            <BarChart data={monthlyBarData} height={250} className="w-full" />
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Total Expenses by Member</h3>
            <BarChart data={memberBarData} height={250} className="w-full" />
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
