import express from "express";
import GoalController from "../controllers/goalController.js";

const router = express.Router();

// Rotas para metas
router.get("/", GoalController.getAllGoals);
router.get("/upcoming", GoalController.getUpcomingGoals);
router.get("/completed", GoalController.getCompletedGoals);
router.get("/:id", GoalController.getGoalById);
router.get("/:id/progress", GoalController.getGoalProgress);
router.post("/", GoalController.createGoal);
router.put("/:id", GoalController.updateGoal);
router.put("/:id/progress", GoalController.updateGoalProgress);
router.post("/:id/add-progress", GoalController.addToGoalProgress);
router.delete("/:id", GoalController.deleteGoal);

export default router;
