import { Router } from "express";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
import getUserService from "../services/UserServices/getUserService";

const router=Router();

router.get("/me",authenticationMiddleware,getUserService);

export default router;