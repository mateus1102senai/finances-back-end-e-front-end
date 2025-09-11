'use client';

import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Activity
} from 'lucide-react';
import Link from 'next/link';

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6',
  '#F97316', '#84CC16', '#06B6D4', '#8B5A2B'
];

export default function Graficos() {
  const { 
    transactions, 
    getExpensesByCategory, 
    getTotalIncome, 
    getTotalExpenses 
  } = useFinance();
  
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('pie');

  // Dados para gráfico de pizza - Despesas por categoria
  const expenseData = getExpensesByCategory(period);

  // Dados para gráfico de barras - Receitas vs Despesas por mês
  const getMonthlyData = () => {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });
    
    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Últimos 6 meses
  };

  // Dados para gráfico de linha - Evolução do saldo
  const getBalanceEvolution = () => {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    let balance = 0;
    const data = [];
    
    sortedTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
      
      data.push({
        date: new Date(transaction.date).toLocaleDateString('pt-BR'),
        balance: balance,
        amount: transaction.type === 'income' ? transaction.amount : -transaction.amount
      });
    });
    
    return data.slice(-30); // Últimas 30 transações
  };

  const monthlyData = getMonthlyData();
  const balanceEvolution = getBalanceEvolution();
  
  const currentIncome = getTotalIncome(period);
  const currentExpenses = getTotalExpenses(period);
  const currentBalance = currentIncome - currentExpenses;

  const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Análise e Gráficos
          </h1>
          <p className="text-gray-600">
            Visualize seus dados financeiros de forma clara e intuitiva
          </p>
        </div>
        <Link href="/">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50">
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
        </Link>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Period Selection */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Período:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setPeriod('month')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  period === 'month'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Este Mês
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  period === 'year'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Este Ano
              </button>
              <button
                onClick={() => setPeriod('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  period === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Visualização:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('pie')}
                className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-full transition-colors ${
                  chartType === 'pie'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <PieChartIcon className="h-4 w-4" />
                <span>Pizza</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-full transition-colors ${
                  chartType === 'bar'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Barras</span>
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-full transition-colors ${
                  chartType === 'line'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Linha</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(currentIncome)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(currentExpenses)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${
                currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(currentBalance)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              currentBalance >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Calendar className={`h-6 w-6 ${
                currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Main Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {chartType === 'pie' && 'Despesas por Categoria'}
            {chartType === 'bar' && 'Receitas vs Despesas por Mês'}
            {chartType === 'line' && 'Evolução do Saldo'}
          </h2>

          {chartType === 'pie' && expenseData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => 
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chartType === 'bar' && monthlyData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={formatMonth}
                />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Receitas" />
                <Bar dataKey="expense" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === 'line' && balanceEvolution.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={balanceEvolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Saldo"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {((chartType === 'pie' && expenseData.length === 0) ||
            (chartType === 'bar' && monthlyData.length === 0) ||
            (chartType === 'line' && balanceEvolution.length === 0)) && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {chartType === 'pie' && <PieChartIcon className="h-8 w-8 text-gray-400" />}
                  {chartType === 'bar' && <BarChart3 className="h-8 w-8 text-gray-400" />}
                  {chartType === 'line' && <Activity className="h-8 w-8 text-gray-400" />}
                </div>
                <p className="text-gray-500">Dados insuficientes para exibir o gráfico</p>
                <p className="text-sm text-gray-400 mt-1">
                  Adicione mais transações para visualizar as análises
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Category Details */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Detalhes por Categoria
          </h2>

          {expenseData.length > 0 ? (
            <div className="space-y-4">
              {expenseData
                .sort((a, b) => b.amount - a.amount)
                .map((item, index) => {
                  const percentage = (item.amount / currentExpenses) * 100;
                  
                  return (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium text-gray-900">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChartIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Nenhuma despesa encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione despesas para ver a análise por categoria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
