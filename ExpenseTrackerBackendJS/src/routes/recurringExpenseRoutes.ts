import { Router } from "express";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
import updateRecurringExpenseService from "../services/RecurringExpenseServices/updateRecurringExpenseService";
import createRecurringExpenseService from "../services/RecurringExpenseServices/createRecurringExpenseService";
import deleteRecurringExpenseService from "../services/RecurringExpenseServices/deleteRecurringExpenseService";

const router=Router();

router.post("/create",authenticationMiddleware,createRecurringExpenseService);
router.put("/update/:recurringExpenseId",authenticationMiddleware,updateRecurringExpenseService);
router.delete("/delete/:recurringExpenseId",authenticationMiddleware,deleteRecurringExpenseService);

export default router;