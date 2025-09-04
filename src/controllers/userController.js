import UserModel from "../models/userModel.js";

class UserController {
  // GET /api/users
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  // GET /api/users/:id
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Remove senha do retorno
      const { password_hash, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }

  // POST /api/users
  async createUser(req, res) {
    try {
      // Validação básica
      const { name, email, password_hash } = req.body;

      // Verifica se os campos obrigatórios foram fornecidos
      if (!name || !email || !password_hash) {
        return res
          .status(400)
          .json({ error: "Nome, email e senha são obrigatórios" });
      }

      // Verifica se o email já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email já está em uso" });
      }

      // Criar o novo usuário
      const newUser = await UserModel.create({
        name,
        email,
        password_hash,
      });

      if (!newUser) {
        return res.status(400).json({ error: "Erro ao criar usuário" });
      }

      // Remove senha do retorno
      const { password_hash: _, ...userResponse } = newUser;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }

  // PUT /api/users/:id
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password_hash } = req.body;

      // Verifica se o usuário existe
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Se está alterando email, verifica se não está em uso
      if (email && email !== existingUser.email) {
        const emailExists = await UserModel.findByEmail(email);
        if (emailExists) {
          return res.status(400).json({ error: "Email já está em uso" });
        }
      }

      // Prepara dados para atualização
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password_hash) updateData.password_hash = password_hash;

      // Atualizar o usuário
      const updatedUser = await UserModel.update(id, updateData);

      // Remove senha do retorno
      const { password_hash: _, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o usuário existe
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Remover o usuário
      await UserModel.delete(id);

      res.status(204).end(); // Resposta sem conteúdo
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      res.status(500).json({ error: "Erro ao remover usuário" });
    }
  }
}

export default new UserController();
