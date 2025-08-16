import { Router } from "express";
import registerUserController from "../controllers/registerUserController";
import loginUserController from "../controllers/loginUserController";

const router = Router();

router.post("/register",registerUserController);
router.post("/login",loginUserController);


export default router;