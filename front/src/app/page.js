'use client';

import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

function StatCard({ title, value, icon: Icon, color = 'blue', trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>
            R$ {value.toFixed(2)}
          </p>
          {trend && (
            <p className={`text-xs flex items-center mt-1 ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}% vs mês anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          isIncome ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isIncome ? (
            <ArrowUpCircle className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDownCircle className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <p className="text-sm text-gray-500">{transaction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${
          isIncome ? 'text-green-600' : 'text-red-600'
        }`}>
          {isIncome ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.date).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon: Icon, label, color = 'blue' }) {
  return (
    <Link href={href}>
      <button className={`w-full flex items-center justify-center space-x-2 p-4 bg-${color}-600 hover:bg-${color}-700 text-white rounded-lg transition-colors`}>
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </button>
    </Link>
  );
}

export default function Home() {
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance, 
    getRecentTransactions,
    goals 
  } = useFinance();

  const monthlyIncome = getTotalIncome('month');
  const monthlyExpenses = getTotalExpenses('month');
  const monthlyBalance = getBalance('month');
  const totalBalance = getBalance('all');
  
  const recentTransactions = getRecentTransactions(5);
  const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá! Bem-vindo ao seu painel financeiro
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo da sua situação financeira atual
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Saldo Total" 
          value={totalBalance} 
          icon={Wallet} 
          color={totalBalance >= 0 ? 'green' : 'red'}
        />
        <StatCard 
          title="Receitas do Mês" 
          value={monthlyIncome} 
          icon={TrendingUp} 
          color="green"
        />
        <StatCard 
          title="Despesas do Mês" 
          value={monthlyExpenses} 
          icon={TrendingDown} 
          color="red"
        />
        <StatCard 
          title="Saldo Mensal" 
          value={monthlyBalance} 
          icon={Calendar} 
          color={monthlyBalance >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Transações Recentes
              </h2>
              <Link href="/cadastro" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver todas
              </Link>
            </div>
            
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Nenhuma transação registrada ainda</p>
                <Link href="/cadastro">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Adicionar primeira transação
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Goals */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <QuickActionButton 
                href="/cadastro" 
                icon={Plus} 
                label="Nova Transação" 
                color="blue"
              />
              <QuickActionButton 
                href="/metas" 
                icon={Target} 
                label="Criar Meta" 
                color="green"
              />
              <QuickActionButton 
                href="/graficos" 
                icon={TrendingUp} 
                label="Ver Gráficos" 
                color="purple"
              />
            </div>
          </div>

          {/* Goals Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Metas Ativas
              </h2>
              <Link href="/metas" className="text-blue-600 hover:text-blue-700 font-medium">
                Ver todas
              </Link>
            </div>
            
            {goals.length > 0 ? (
              <div>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {activeGoals}
                </p>
                <p className="text-gray-600 text-sm">
                  {activeGoals === 1 ? 'meta em andamento' : 'metas em andamento'}
                </p>
                
                {goals.slice(0, 2).map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal.id} className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{goal.name}</span>
                        <span className="text-xs text-gray-500">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        R$ {goal.currentAmount.toFixed(2)} / R$ {goal.targetAmount.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nenhuma meta definida</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
