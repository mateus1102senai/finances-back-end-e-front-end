'use client';

import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Target, 
  Plus, 
  ArrowLeft, 
  Calendar,
  TrendingUp,
  Trash2,
  DollarSign,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function Metas() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: ''
  });
  const [contributionAmount, setContributionAmount] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      return;
    }

    addGoal({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount)
    });

    // Reset form
    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
      description: ''
    });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContribution = (goalId) => {
    const amount = parseFloat(contributionAmount[goalId] || 0);
    if (amount > 0) {
      updateGoal(goalId, amount);
      setContributionAmount(prev => ({
        ...prev,
        [goalId]: ''
      }));
    }
  };

  const getGoalStatus = (goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (progress >= 100) {
      return { status: 'completed', color: 'green', text: 'Concluída' };
    } else if (daysRemaining < 0) {
      return { status: 'overdue', color: 'red', text: 'Atrasada' };
    } else if (daysRemaining <= 7) {
      return { status: 'urgent', color: 'yellow', text: 'Urgente' };
    } else {
      return { status: 'active', color: 'blue', text: 'Em andamento' };
    }
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} dias atrasado`;
    } else if (diffDays === 0) {
      return 'Hoje';
    } else if (diffDays === 1) {
      return '1 dia restante';
    } else {
      return `${diffDays} dias restantes`;
    }
  };

  const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Metas Financeiras
          </h1>
          <p className="text-gray-600">
            Defina e acompanhe seus objetivos de economia
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Meta</span>
          </button>
          <Link href="/">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Metas</p>
              <p className="text-2xl font-bold text-blue-600">{goals.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Metas Ativas</p>
              <p className="text-2xl font-bold text-yellow-600">{activeGoals.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Metas Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* New Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Meta</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Meta
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Reserva de emergência"
                />
              </div>

              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Objetivo (R$)
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Data Limite
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva o objetivo desta meta..."
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Criar Meta
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="space-y-6">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Metas Ativas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGoals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  const goalStatus = getGoalStatus(goal);
                  
                  return (
                    <div key={goal.id} className="bg-white rounded-xl shadow-sm border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                          {goal.description && (
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${goalStatus.color}-100 text-${goalStatus.color}-700`}>
                            {goalStatus.text}
                          </span>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            R$ {goal.currentAmount.toFixed(2)} / R$ {goal.targetAmount.toFixed(2)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full bg-${goalStatus.color}-500`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Goal Info */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{getDaysRemaining(goal.deadline)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Restam R$ {(goal.targetAmount - goal.currentAmount).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Contribution Input */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Valor"
                          value={contributionAmount[goal.id] || ''}
                          onChange={(e) => setContributionAmount(prev => ({
                            ...prev,
                            [goal.id]: e.target.value
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                          onClick={() => handleContribution(goal.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Contribuir</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Metas Concluídas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900 flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>{goal.name}</span>
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-green-700 mt-1">{goal.description}</p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 text-green-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-sm text-green-700">
                      <p className="font-medium">
                        Objetivo alcançado: R$ {goal.targetAmount.toFixed(2)}
                      </p>
                      <p>Concluída em: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Nenhuma meta definida ainda
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Criar metas financeiras é essencial para alcançar seus objetivos. 
            Comece definindo sua primeira meta de economia.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Criar Primeira Meta</span>
          </button>
        </div>
      )}
    </div>
  );
}
