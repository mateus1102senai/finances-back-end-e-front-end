import express from "express";
import userRoutes from "./userRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import goalRoutes from "./goalRoutes.js";

const router = express.Router();

// Definir rotas da API
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/goals", goalRoutes);

// Rota raiz
router.get("/", (req, res) => {
  res.json({
    message: "API de Gerenciamento Financeiro Pessoal",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      transactions: "/api/transactions",
      goals: "/api/goals"
    }
  });
});

export default router;
