import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Expense interface
export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
}

// Define the context type
interface BudgetContextType {
  monthlyBudget: number;
  expenses: Expense[];
  totalSpent: number;
  remaining: number;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateBudget: (amount: number) => void;
  getExpensesByCategory: () => Record<string, number>;
  currency: string;
  setCurrency: (currency: string) => void;
}

// Create the context
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// ✅ HELPER FUNCTION: Get current month as "YYYY-MM" (defined OUTSIDE component)
const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// ✅ PROVIDER COMPONENT: All hooks MUST be inside this function
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // State: Monthly budget
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 500;
  });

  // State: Expenses list
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  // State: Currency
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'EUR';
  });

  // ✅ State: Track last reset month (NEW for monthly reset)
  const [lastResetMonth, setLastResetMonth] = useState<string>(() => {
    const saved = localStorage.getItem('budgetMonth');
    return saved || getCurrentMonth();
  });

  // Save budget to localStorage
  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save currency to localStorage
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Save last reset month to localStorage
  useEffect(() => {
    localStorage.setItem('budgetMonth', lastResetMonth);
  }, [lastResetMonth]);

  // ✅ NEW: Check if month changed → reset expenses automatically
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    
    if (lastResetMonth !== currentMonth) {
      // New month detected! Clear all expenses
      setExpenses([]);
      setLastResetMonth(currentMonth);
    }
  }, [lastResetMonth]); // Only re-run when lastResetMonth changes

  // Calculate totals (pure functions - no hooks here)
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = monthlyBudget - totalSpent;

  // Add a new expense
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  // Update monthly budget
  const updateBudget = (amount: number) => {
    setMonthlyBudget(amount);
  };

  // Get expenses grouped by category
  const getExpensesByCategory = () => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  };

  // Return the provider with all values
  return (
    <BudgetContext.Provider value={{
      monthlyBudget,
      expenses,
      totalSpent,
      remaining,
      addExpense,
      updateBudget,
      getExpensesByCategory,
      currency,
      setCurrency,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

// ✅ Custom hook to use the context (defined OUTSIDE component)
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};