import GoalModel from "../models/goalModel.js";

class GoalController {
  // GET /api/goals - Listar metas do usuário
  async getAllGoals(req, res) {
    try {
      const { userId } = req.query; // Ou req.user.id se tiver middleware de autenticação
      
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const goals = await GoalModel.findAllByUser(userId);
      res.json(goals);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
      res.status(500).json({ error: "Erro ao buscar metas" });
    }
  }

  // GET /api/goals/:id - Obter meta específica
  async getGoalById(req, res) {
    try {
      const { id } = req.params;

      const goal = await GoalModel.findById(id);

      if (!goal) {
        return res.status(404).json({ error: "Meta não encontrada" });
      }

      res.json(goal);
    } catch (error) {
      console.error("Erro ao buscar meta:", error);
      res.status(500).json({ error: "Erro ao buscar meta" });
    }
  }

  // POST /api/goals - Criar nova meta
  async createGoal(req, res) {
    try {
      const { userId, title, target_amount, current_amount, deadline } = req.body;

      // Validação básica
      if (!userId || !title || !target_amount || !deadline) {
        return res.status(400).json({ 
          error: "Campos obrigatórios: userId, title, target_amount, deadline" 
        });
      }

      // Validar valor alvo
      if (isNaN(target_amount) || Number(target_amount) <= 0) {
        return res.status(400).json({ 
          error: "Valor alvo deve ser um número positivo" 
        });
      }

      // Validar valor atual se fornecido
      if (current_amount && (isNaN(current_amount) || Number(current_amount) < 0)) {
        return res.status(400).json({ 
          error: "Valor atual deve ser um número não negativo" 
        });
      }

      // Validar data
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        return res.status(400).json({ 
          error: "Data limite deve ser futura" 
        });
      }

      const newGoal = await GoalModel.create({
        userId,
        title,
        target_amount,
        current_amount: current_amount || 0,
        deadline,
      });

      res.status(201).json(newGoal);
    } catch (error) {
      console.error("Erro ao criar meta:", error);
      res.status(500).json({ error: "Erro ao criar meta" });
    }
  }

  // PUT /api/goals/:id - Atualizar meta
  async updateGoal(req, res) {
    try {
      const { id } = req.params;
      const { title, target_amount, current_amount, deadline } = req.body;

      // Verificar se a meta existe
      const existingGoal = await GoalModel.findById(id);
      if (!existingGoal) {
        return res.status(404).json({ error: "Meta não encontrada" });
      }

      // Validar valor alvo se fornecido
      if (target_amount && (isNaN(target_amount) || Number(target_amount) <= 0)) {
        return res.status(400).json({ 
          error: "Valor alvo deve ser um número positivo" 
        });
      }

      // Validar valor atual se fornecido
      if (current_amount !== undefined && (isNaN(current_amount) || Number(current_amount) < 0)) {
        return res.status(400).json({ 
          error: "Valor atual deve ser um número não negativo" 
        });
      }

      // Validar data se fornecida
      if (deadline) {
        const deadlineDate = new Date(deadline);
        if (deadlineDate <= new Date()) {
          return res.status(400).json({ 
            error: "Data limite deve ser futura" 
          });
        }
      }

      // Preparar dados para atualização
      const updateData = {};
      if (title) updateData.title = title;
      if (target_amount) updateData.target_amount = target_amount;
      if (current_amount !== undefined) updateData.current_amount = current_amount;
      if (deadline) updateData.deadline = deadline;

      const updatedGoal = await GoalModel.update(id, updateData);
      res.json(updatedGoal);
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
      res.status(500).json({ error: "Erro ao atualizar meta" });
    }
  }

  // DELETE /api/goals/:id - Remover meta
  async deleteGoal(req, res) {
    try {
      const { id } = req.params;

      // Verificar se a meta existe
      const existingGoal = await GoalModel.findById(id);
      if (!existingGoal) {
        return res.status(404).json({ error: "Meta não encontrada" });
      }

      await GoalModel.delete(id);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao remover meta:", error);
      res.status(500).json({ error: "Erro ao remover meta" });
    }
  }

  // GET /api/goals/:id/progress - Obter progresso da meta
  async getGoalProgress(req, res) {
    try {
      const { id } = req.params;

      const progress = await GoalModel.getProgress(id);

      if (!progress) {
        return res.status(404).json({ error: "Meta não encontrada" });
      }

      res.json(progress);
    } catch (error) {
      console.error("Erro ao obter progresso da meta:", error);
      res.status(500).json({ error: "Erro ao obter progresso da meta" });
    }
  }

  // PUT /api/goals/:id/progress - Atualizar progresso da meta
  async updateGoalProgress(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || isNaN(amount) || Number(amount) < 0) {
        return res.status(400).json({ 
          error: "Valor deve ser um número não negativo" 
        });
      }

      const updatedGoal = await GoalModel.updateProgress(id, amount);

      if (!updatedGoal) {
        return res.status(404).json({ error: "Meta não encontrada" });
      }

      res.json(updatedGoal);
    } catch (error) {
      console.error("Erro ao atualizar progresso da meta:", error);
      res.status(500).json({ error: "Erro ao atualizar progresso da meta" });
    }
  }

  // POST /api/goals/:id/add-progress - Adicionar valor ao progresso
  async addToGoalProgress(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ 
          error: "Valor deve ser um número positivo" 
        });
      }

      const updatedGoal = await GoalModel.addToProgress(id, amount);

      if (!updatedGoal) {
        return res.status(404).json({ error: "Meta não encontrada" });
      }

      res.json(updatedGoal);
    } catch (error) {
      console.error("Erro ao adicionar valor à meta:", error);
      res.status(500).json({ error: "Erro ao adicionar valor à meta" });
    }
  }

  // GET /api/goals/upcoming - Obter metas próximas do prazo
  async getUpcomingGoals(req, res) {
    try {
      const { userId, days = 30 } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const goals = await GoalModel.findUpcomingDeadlines(userId, Number(days));
      res.json(goals);
    } catch (error) {
      console.error("Erro ao buscar metas próximas do prazo:", error);
      res.status(500).json({ error: "Erro ao buscar metas próximas do prazo" });
    }
  }

  // GET /api/goals/completed - Obter metas concluídas
  async getCompletedGoals(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const goals = await GoalModel.findCompleted(userId);
      res.json(goals);
    } catch (error) {
      console.error("Erro ao buscar metas concluídas:", error);
      res.status(500).json({ error: "Erro ao buscar metas concluídas" });
    }
  }
}

export default new GoalController();
