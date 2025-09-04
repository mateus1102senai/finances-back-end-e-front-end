import express from "express";
import TransactionController from "../controllers/transactionController.js";

const router = express.Router();

// Rotas para transações
router.get("/", TransactionController.getAllTransactions);
router.get("/summary", TransactionController.getFinancialSummary);
router.get("/category/:category", TransactionController.getTransactionsByCategory);
router.get("/type/:type", TransactionController.getTransactionsByType);
router.get("/:id", TransactionController.getTransactionById);
router.post("/", TransactionController.createTransaction);
router.put("/:id", TransactionController.updateTransaction);
router.delete("/:id", TransactionController.deleteTransaction);

export default router;
