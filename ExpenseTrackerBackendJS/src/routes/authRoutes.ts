import { Router } from "express";
import registerUserService from "../services/UserServices/registerUserService";
import loginUserService from "../services/UserServices/loginUserService";

const router = Router();

router.post("/register",registerUserService);
router.post("/login",loginUserService);


export default router;