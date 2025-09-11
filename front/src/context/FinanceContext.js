'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const FinanceContext = createContext();

const initialState = {
  transactions: [],
  goals: [],
  categories: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Entretenimento',
    'Compras',
    'Outros',
    'Salário',
    'Freelance',
    'Investimentos',
    'Renda Extra'
  ],
  alerts: {
    monthlyLimit: 0,
    alertEnabled: false
  }
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    case 'ADD_TRANSACTION':
      const newTransactions = [...state.transactions, action.payload];
      return { ...state, transactions: newTransactions };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        )
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };
    
    case 'UPDATE_ALERTS':
      return { ...state, alerts: action.payload };
    
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(state));
  }, [state]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date(transaction.date).toISOString()
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    // Verificar alertas
    if (state.alerts.alertEnabled && transaction.type === 'expense') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyExpenses = state.transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'expense' && 
                 tDate.getMonth() === currentMonth && 
                 tDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0) + transaction.amount;
      
      if (monthlyExpenses > state.alerts.monthlyLimit) {
        toast.error(`Atenção! Você ultrapassou seu limite mensal de R$ ${state.alerts.monthlyLimit.toFixed(2)}`);
      }
    }
    
    toast.success(
      transaction.type === 'income' 
        ? 'Receita adicionada com sucesso!' 
        : 'Despesa adicionada com sucesso!'
    );
  };

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    toast.success('Transação excluída com sucesso!');
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      currentAmount: 0
    };
    
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    toast.success('Meta criada com sucesso!');
  };

  const updateGoal = (goalId, amount) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        currentAmount: Math.min(goal.targetAmount, goal.currentAmount + amount)
      };
      
      dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });
      
      if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
        toast.success(`Parabéns! Você atingiu a meta "${goal.name}"!`);
      }
    }
  };

  const deleteGoal = (id) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
    toast.success('Meta excluída com sucesso!');
  };

  const updateAlerts = (alerts) => {
    dispatch({ type: 'UPDATE_ALERTS', payload: alerts });
    toast.success('Configurações de alerta atualizadas!');
  };

  // Cálculos úteis
  const getTotalIncome = (period = 'all') => {
    return state.transactions
      .filter(t => t.type === 'income' && filterByPeriod(t, period))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = (period = 'all') => {
    return state.transactions
      .filter(t => t.type === 'expense' && filterByPeriod(t, period))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = (period = 'all') => {
    return getTotalIncome(period) - getTotalExpenses(period);
  };

  const filterByPeriod = (transaction, period) => {
    if (period === 'all') return true;
    
    const tDate = new Date(transaction.date);
    const now = new Date();
    
    switch (period) {
      case 'month':
        return tDate.getMonth() === now.getMonth() && 
               tDate.getFullYear() === now.getFullYear();
      case 'year':
        return tDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const getExpensesByCategory = (period = 'month') => {
    const expenses = state.transactions.filter(t => 
      t.type === 'expense' && filterByPeriod(t, period)
    );
    
    const byCategory = {};
    expenses.forEach(expense => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });
    
    return Object.entries(byCategory).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  const getRecentTransactions = (limit = 5) => {
    return [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const value = {
    ...state,
    addTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    updateAlerts,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getExpensesByCategory,
    getRecentTransactions
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
}
