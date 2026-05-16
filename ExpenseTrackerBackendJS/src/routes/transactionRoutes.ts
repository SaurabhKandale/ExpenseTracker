import { Router } from "express";
import authMiddleware from "../middlewares/authenticationMiddleware";
import createTransactionService from "../services/TransactionServices/createTransactionService";
import getTransactionsService from "../services/TransactionServices/getTransactionsService";
import updateTransactionService from "../services/TransactionServices/updateTransactionService";
import removeTransactionService from "../services/TransactionServices/removeTransactionService";


const router= Router();

router.post("/create",authMiddleware,createTransactionService);
router.get("/get/:date",authMiddleware,getTransactionsService);
router.put("/update/:transactionId",updateTransactionService);
router.delete("/remove/:transactionId",authMiddleware,removeTransactionService);


export default router;