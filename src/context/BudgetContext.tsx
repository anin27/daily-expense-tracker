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

// Provider component
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 500;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'EUR';
  });

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Calculate totals
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

// ============================================
// IMPORTANT: This is the custom hook that Home.tsx uses
// ============================================
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};