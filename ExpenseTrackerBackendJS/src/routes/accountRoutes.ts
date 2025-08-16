import { Router } from "express";
import createAccountController from "../controllers/createAccountController";
import authMiddleware from "../middlewares/authenticationMiddleware";
import updateAccountController from "../controllers/updateAccountController";
import deleteAccountController from "../controllers/deleteAccountController";


const router = Router();

router.post("/create",authMiddleware, createAccountController);
router.put("/update/:accountId",authMiddleware, updateAccountController);
router.put("/remove/:accountId",authMiddleware,deleteAccountController);


export default router;