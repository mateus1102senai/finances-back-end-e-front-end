import TransactionModel from "../models/transactionModel.js";

class TransactionController {
  // GET /api/transactions - Listar transações do usuário
  async getAllTransactions(req, res) {
    try {
      const { userId } = req.query; // Ou req.user.id se tiver middleware de autenticação
      
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const transactions = await TransactionModel.findAllByUser(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      res.status(500).json({ error: "Erro ao buscar transações" });
    }
  }

  // GET /api/transactions/:id - Obter transação específica
  async getTransactionById(req, res) {
    try {
      const { id } = req.params;

      const transaction = await TransactionModel.findById(id);

      if (!transaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      res.json(transaction);
    } catch (error) {
      console.error("Erro ao buscar transação:", error);
      res.status(500).json({ error: "Erro ao buscar transação" });
    }
  }

  // POST /api/transactions - Criar nova transação
  async createTransaction(req, res) {
    try {
      const { userId, type, amount, description, category, date } = req.body;

      // Validação básica
      if (!userId || !type || !amount || !description || !category || !date) {
        return res.status(400).json({ 
          error: "Todos os campos são obrigatórios (userId, type, amount, description, category, date)" 
        });
      }

      // Validar tipo
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({ 
          error: "Tipo deve ser 'income' ou 'expense'" 
        });
      }

      // Validar valor
      if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ 
          error: "Valor deve ser um número positivo" 
        });
      }

      const newTransaction = await TransactionModel.create({
        userId,
        type,
        amount,
        description,
        category,
        date,
      });

      res.status(201).json(newTransaction);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      res.status(500).json({ error: "Erro ao criar transação" });
    }
  }

  // PUT /api/transactions/:id - Atualizar transação
  async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const { type, amount, description, category, date } = req.body;

      // Verificar se a transação existe
      const existingTransaction = await TransactionModel.findById(id);
      if (!existingTransaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      // Validar tipo se fornecido
      if (type && !["income", "expense"].includes(type)) {
        return res.status(400).json({ 
          error: "Tipo deve ser 'income' ou 'expense'" 
        });
      }

      // Validar valor se fornecido
      if (amount && (isNaN(amount) || Number(amount) <= 0)) {
        return res.status(400).json({ 
          error: "Valor deve ser um número positivo" 
        });
      }

      // Preparar dados para atualização
      const updateData = {};
      if (type) updateData.type = type;
      if (amount) updateData.amount = amount;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (date) updateData.date = date;

      const updatedTransaction = await TransactionModel.update(id, updateData);
      res.json(updatedTransaction);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      res.status(500).json({ error: "Erro ao atualizar transação" });
    }
  }

  // DELETE /api/transactions/:id - Remover transação
  async deleteTransaction(req, res) {
    try {
      const { id } = req.params;

      // Verificar se a transação existe
      const existingTransaction = await TransactionModel.findById(id);
      if (!existingTransaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      await TransactionModel.delete(id);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao remover transação:", error);
      res.status(500).json({ error: "Erro ao remover transação" });
    }
  }

  // GET /api/transactions/category/:category - Obter transações por categoria
  async getTransactionsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const transactions = await TransactionModel.findByCategory(userId, category);
      res.json(transactions);
    } catch (error) {
      console.error("Erro ao buscar transações por categoria:", error);
      res.status(500).json({ error: "Erro ao buscar transações por categoria" });
    }
  }

  // GET /api/transactions/type/:type - Obter transações por tipo
  async getTransactionsByType(req, res) {
    try {
      const { type } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({ 
          error: "Tipo deve ser 'income' ou 'expense'" 
        });
      }

      const transactions = await TransactionModel.findByType(userId, type);
      res.json(transactions);
    } catch (error) {
      console.error("Erro ao buscar transações por tipo:", error);
      res.status(500).json({ error: "Erro ao buscar transações por tipo" });
    }
  }

  // GET /api/transactions/summary - Obter resumo financeiro
  async getFinancialSummary(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const summary = await TransactionModel.getFinancialSummary(userId);
      res.json(summary);
    } catch (error) {
      console.error("Erro ao obter resumo financeiro:", error);
      res.status(500).json({ error: "Erro ao obter resumo financeiro" });
    }
  }
}

export default new TransactionController();
