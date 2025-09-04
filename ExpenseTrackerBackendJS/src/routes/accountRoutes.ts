import { Router } from "express";
import authMiddleware from "../middlewares/authenticationMiddleware";
import createAccountService from "../services/AccountServices/createAccountService";
import updateAccountService from "../services/AccountServices/updateAccountService";
import deleteAccountService from "../services/AccountServices/deleteAccountService";


const router = Router();

router.post("/create",authMiddleware, createAccountService);
router.put("/update/:accountId",authMiddleware, updateAccountService);
router.put("/remove/:accountId",authMiddleware,deleteAccountService);


export default router;