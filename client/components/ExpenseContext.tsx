import { createContext, useContext, useState, useEffect } from "react";

export interface Expense {
  id: string;
  category: string;
  amount: number;
  paidBy: string;
  comment?: string;
  date: string;
  time: string;
  type: "Personal" | string; // Personal or group name
  emoji: string;
  groupId: string;
  createdAt: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
  getExpensesByGroup: (groupId: string) => Expense[];
  getTotalSpending: (groupId?: string) => number;
  getExpensesByCategory: (category: string, groupId?: string) => Expense[];
  getExpensesByType: (type: string, groupId?: string) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Sample initial data
const sampleExpenses: Expense[] = [
  {
    id: "1",
    category: "Food",
    amount: 1200,
    paidBy: "Tejas",
    comment: "Dinner at Italian restaurant",
    date: "2024-01-15",
    time: "20:30",
    type: "Our Family",
    emoji: "🍔",
    groupId: "family",
    createdAt: "2024-01-15T20:30:00Z",
  },
  {
    id: "2",
    category: "Grocery",
    amount: 3500,
    paidBy: "Priyanka",
    comment: "Weekly grocery shopping",
    date: "2024-01-14",
    time: "18:45",
    type: "Our Family",
    emoji: "🛒",
    groupId: "family",
    createdAt: "2024-01-14T18:45:00Z",
  },
  {
    id: "3",
    category: "Health",
    amount: 2200,
    paidBy: "Tejas",
    comment: "Doctor consultation and medicines",
    date: "2024-01-12",
    time: "16:30",
    type: "Personal",
    emoji: "🏥",
    groupId: "family",
    createdAt: "2024-01-12T16:30:00Z",
  },
];

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);

  // Load from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expense-tracker-expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save to localStorage when expenses change
  useEffect(() => {
    localStorage.setItem("expense-tracker-expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpense: Omit<Expense, "id" | "createdAt">) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [expense, ...prev]);
  };

  const getExpensesByGroup = (groupId: string) => {
    return expenses.filter((expense) => expense.groupId === groupId);
  };

  const getTotalSpending = (groupId?: string) => {
    const filteredExpenses = groupId ? getExpensesByGroup(groupId) : expenses;
    return filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
  };

  const getExpensesByCategory = (category: string, groupId?: string) => {
    let filteredExpenses = groupId ? getExpensesByGroup(groupId) : expenses;

    if (category === "All") return filteredExpenses;
    return filteredExpenses.filter((expense) => expense.category === category);
  };

  const getExpensesByType = (type: string, groupId?: string) => {
    let filteredExpenses = groupId ? getExpensesByGroup(groupId) : expenses;

    if (type === "All") return filteredExpenses;
    return filteredExpenses.filter((expense) => expense.type === type);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        getExpensesByGroup,
        getTotalSpending,
        getExpensesByCategory,
        getExpensesByType,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
}
