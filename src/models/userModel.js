
import prisma from "../../prisma/prisma.js";

class UserModel {
  // Obter todos os usuários
  async findAll() {
    return await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  // Obter usuário pelo ID
  async findById(id) {
    return await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  // Obter usuário pelo email
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  // Criar novo usuário
  async create({ name, email, password_hash }) {
    return await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    });
  }

  // Atualizar usuário
  async update(id, data) {
    return await prisma.user.update({
      where: {
        id: Number(id),
      },
      data,
    });
  }

  // Remover usuário
  async delete(id) {
    return await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
  }
}

export default new UserModel();
