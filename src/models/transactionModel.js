import prisma from "../../prisma/prisma.js";

class TransactionModel {
  // Obter todas as transações de um usuário
  async findAllByUser(userId) {
    return await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Obter transação pelo ID
  async findById(id) {
    return await prisma.transaction.findUnique({
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

  // Criar nova transação
  async create({ userId, type, amount, description, category, date }) {
    return await prisma.transaction.create({
      data: {
        userId: Number(userId),
        type,
        amount: Number(amount),
        description,
        category,
        date: new Date(date),
      },
    });
  }

  // Atualizar transação
  async update(id, data) {
    const updateData = { ...data };
    if (updateData.amount) {
      updateData.amount = Number(updateData.amount);
    }
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    if (updateData.userId) {
      updateData.userId = Number(updateData.userId);
    }

    return await prisma.transaction.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });
  }

  // Remover transação
  async delete(id) {
    return await prisma.transaction.delete({
      where: {
        id: Number(id),
      },
    });
  }

  // Obter transações por categoria
  async findByCategory(userId, category) {
    return await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
        category,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Obter transações por tipo (income/expense)
  async findByType(userId, type) {
    return await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
        type,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Obter transações por período
  async findByDateRange(userId, startDate, endDate) {
    return await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // Obter resumo financeiro
  async getFinancialSummary(userId) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: Number(userId),
      },
    });

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: transactions.length,
    };

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        summary.totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        summary.totalExpense += transaction.amount;
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpense;

    return summary;
  }
}

export default new TransactionModel();
