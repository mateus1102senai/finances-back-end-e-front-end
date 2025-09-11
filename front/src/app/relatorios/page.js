'use client';

import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Download, 
  ArrowLeft, 
  FileText,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function Relatorios() {
  const { 
    transactions, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    getExpensesByCategory 
  } = useFinance();
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    category: 'all'
  });

  const [reportType, setReportType] = useState('summary');

  // Filtrar transações com base nos filtros
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      // Filtro por data
      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;

      // Filtro por tipo
      if (filters.type !== 'all' && transaction.type !== filters.type) return false;

      // Filtro por categoria
      if (filters.category !== 'all' && transaction.category !== filters.category) return false;

      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calcular estatísticas do período filtrado
  const getFilteredStats = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

    // Gastos por categoria
    const expensesByCategory = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    return {
      income,
      expenses,
      balance,
      transactionCount: filteredTransactions.length,
      expensesByCategory: Object.entries(expensesByCategory)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
    };
  };

  const stats = getFilteredStats();

  // Exportar para PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Título
    doc.setFontSize(20);
    doc.text('Relatório Financeiro', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Período
    if (filters.startDate || filters.endDate) {
      doc.setFontSize(12);
      const period = `Período: ${filters.startDate || 'Início'} até ${filters.endDate || 'Hoje'}`;
      doc.text(period, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
    }

    // Resumo Financeiro
    doc.setFontSize(16);
    doc.text('Resumo Financeiro', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`Receitas: R$ ${stats.income.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Despesas: R$ ${stats.expenses.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Saldo: R$ ${stats.balance.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total de Transações: ${stats.transactionCount}`, 20, yPosition);
    yPosition += 20;

    // Despesas por Categoria
    if (stats.expensesByCategory.length > 0) {
      doc.setFontSize(16);
      doc.text('Despesas por Categoria', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      stats.expensesByCategory.forEach(({ category, amount }) => {
        const percentage = ((amount / stats.expenses) * 100).toFixed(1);
        doc.text(`${category}: R$ ${amount.toFixed(2)} (${percentage}%)`, 20, yPosition);
        yPosition += 10;
      });
      yPosition += 15;
    }

    // Transações
    if (reportType === 'detailed' && filteredTransactions.length > 0) {
      doc.setFontSize(16);
      doc.text('Transações Detalhadas', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      filteredTransactions.forEach((transaction, index) => {
        if (yPosition > 250) { // Nova página se necessário
          doc.addPage();
          yPosition = 20;
        }

        const type = transaction.type === 'income' ? 'Receita' : 'Despesa';
        const sign = transaction.type === 'income' ? '+' : '-';
        const date = new Date(transaction.date).toLocaleDateString('pt-BR');
        
        doc.text(`${index + 1}. ${transaction.description}`, 20, yPosition);
        yPosition += 7;
        doc.text(`   ${type} - ${transaction.category} - ${date} - ${sign}R$ ${transaction.amount.toFixed(2)}`, 20, yPosition);
        yPosition += 12;
      });
    }

    // Salvar PDF
    const fileName = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // Exportar para Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Planilha de Resumo
    const summaryData = [
      ['Relatório Financeiro'],
      [''],
      ['Resumo do Período'],
      ['Receitas', `R$ ${stats.income.toFixed(2)}`],
      ['Despesas', `R$ ${stats.expenses.toFixed(2)}`],
      ['Saldo', `R$ ${stats.balance.toFixed(2)}`],
      ['Total de Transações', stats.transactionCount],
      [''],
      ['Despesas por Categoria'],
      ...stats.expensesByCategory.map(({ category, amount }) => [
        category, 
        `R$ ${amount.toFixed(2)}`,
        `${((amount / stats.expenses) * 100).toFixed(1)}%`
      ])
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWs, 'Resumo');

    // Planilha de Transações
    if (filteredTransactions.length > 0) {
      const transactionsData = [
        ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']
      ];

      filteredTransactions.forEach(transaction => {
        transactionsData.push([
          new Date(transaction.date).toLocaleDateString('pt-BR'),
          transaction.description,
          transaction.category,
          transaction.type === 'income' ? 'Receita' : 'Despesa',
          transaction.amount
        ]);
      });

      const transactionsWs = XLSX.utils.aoa_to_sheet(transactionsData);
      XLSX.utils.book_append_sheet(workbook, transactionsWs, 'Transações');
    }

    // Salvar Excel
    const fileName = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: 'all',
      category: 'all'
    });
  };

  // Obter todas as categorias únicas
  const allCategories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Relatórios Financeiros
          </h1>
          <p className="text-gray-600">
            Gere relatórios detalhados das suas finanças
          </p>
        </div>
        <Link href="/">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50">
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpar Filtros
          </button>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Tipo de Relatório:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setReportType('summary')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  reportType === 'summary'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Resumo
              </button>
              <button
                onClick={() => setReportType('detailed')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  reportType === 'detailed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Detalhado
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {stats.income.toFixed(2)}
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
                R$ {stats.expenses.toFixed(2)}
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
                stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                R$ {stats.balance.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              stats.balance >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <DollarSign className={`h-6 w-6 ${
                stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transações</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.transactionCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exportar Relatório</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Exportar PDF</span>
          </button>
          
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expenses by Category */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Despesas por Categoria
            </h2>

            {stats.expensesByCategory.length > 0 ? (
              <div className="space-y-4">
                {stats.expensesByCategory.map((item, index) => {
                  const percentage = ((item.amount / stats.expenses) * 100).toFixed(1);
                  
                  return (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {item.category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          R$ {item.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma despesa encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {reportType === 'detailed' ? 'Transações Detalhadas' : 'Últimas Transações'}
            </h2>

            {filteredTransactions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(reportType === 'detailed' ? filteredTransactions : filteredTransactions.slice(0, 10))
                  .map((transaction) => {
                    const isIncome = transaction.type === 'income';
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isIncome ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {isIncome ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{transaction.category}</span>
                                <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <span className={`font-semibold ${
                          isIncome ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isIncome ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma transação encontrada com os filtros aplicados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
