import prisma from "../../prisma/prisma.js";

class GoalModel {
  // Obter todas as metas de um usuário
  async findAllByUser(userId) {
    return await prisma.goal.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: {
        deadline: "asc",
      },
    });
  }

  // Obter meta pelo ID
  async findById(id) {
    return await prisma.goal.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Criar nova meta
  async create({ userId, title, target_amount, current_amount = 0, deadline }) {
    return await prisma.goal.create({
      data: {
        userId: Number(userId),
        title,
        target_amount: Number(target_amount),
        current_amount: Number(current_amount),
        deadline: new Date(deadline),
      },
    });
  }

  // Atualizar meta
  async update(id, data) {
    const updateData = { ...data };
    if (updateData.target_amount) {
      updateData.target_amount = Number(updateData.target_amount);
    }
    if (updateData.current_amount !== undefined) {
      updateData.current_amount = Number(updateData.current_amount);
    }
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    if (updateData.userId) {
      updateData.userId = Number(updateData.userId);
    }

    return await prisma.goal.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });
  }

  // Remover meta
  async delete(id) {
    return await prisma.goal.delete({
      where: {
        id: Number(id),
      },
    });
  }

  // Atualizar progresso da meta
  async updateProgress(id, amount) {
    const goal = await this.findById(id);
    if (!goal) return null;

    return await this.update(id, {
      current_amount: Number(amount),
    });
  }

  // Adicionar valor ao progresso da meta
  async addToProgress(id, amount) {
    const goal = await this.findById(id);
    if (!goal) return null;

    const newAmount = goal.current_amount + Number(amount);
    return await this.update(id, {
      current_amount: newAmount,
    });
  }

  // Obter progresso da meta (porcentagem)
  async getProgress(id) {
    const goal = await this.findById(id);
    if (!goal) return null;

    const progress = (goal.current_amount / goal.target_amount) * 100;
    const isCompleted = progress >= 100;
    
    // Calcular dias restantes
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    return {
      ...goal,
      progress: Math.min(progress, 100),
      isCompleted,
      daysRemaining,
      amountRemaining: Math.max(goal.target_amount - goal.current_amount, 0),
    };
  }

  // Obter metas próximas do prazo
  async findUpcomingDeadlines(userId, days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await prisma.goal.findMany({
      where: {
        userId: Number(userId),
        deadline: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });
  }

  // Obter metas concluídas
  async findCompleted(userId) {
    const goals = await this.findAllByUser(userId);
    return goals.filter(goal => goal.current_amount >= goal.target_amount);
  }
}

export default new GoalModel();
