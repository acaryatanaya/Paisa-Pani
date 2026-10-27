import { createContext, useContext, useState, useEffect } from "react";

export interface Expense {
  id: string;
  category: string;
  amount: number;
  paidBy: string;
  comment?: string;
  date: string;
  time: string;
  type: "Personal" | string;
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
const STORAGE_KEY = "expense-tracker-expenses";
const LEGACY_DEMO_IDS = new Set(["1", "2", "3"]);

function readSavedExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Remove only the known demo records; preserve any other user-created local records.
    return parsed.filter(
      (expense): expense is Expense =>
        !!expense && typeof expense === "object" &&
        typeof expense.id === "string" && !LEGACY_DEMO_IDS.has(expense.id),
    );
  } catch {
    return [];
  }
}

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setExpenses(readSavedExpenses());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, initialized]);

  const addExpense = (newExpense: Omit<Expense, "id" | "createdAt">) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [expense, ...prev]);
  };

  const getExpensesByGroup = (groupId: string) =>
    groupId ? expenses.filter((expense) => expense.groupId === groupId) : expenses;

  const getTotalSpending = (groupId?: string) => {
    const filteredExpenses = groupId ? getExpensesByGroup(groupId) : expenses;
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = (category: string, groupId?: string) => {
    const filteredExpenses = groupId ? getExpensesByGroup(groupId) : expenses;
    return category === "All" ? filteredExpenses : filteredExpenses.filter((expense) => expense.category === category);
  };

  const getExpensesByType = (type: string, groupId?: string) => {
    const filteredExpenses = groupId ? getExpensesByGroup(groupId) : expenses;
    return type === "All" ? filteredExpenses : filteredExpenses.filter((expense) => expense.type === type);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, getExpensesByGroup, getTotalSpending, getExpensesByCategory, getExpensesByType }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpense must be used within an ExpenseProvider");
  return context;
}
