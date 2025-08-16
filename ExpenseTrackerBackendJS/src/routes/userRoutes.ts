import { Router } from "express";
import authenticationMiddleware from "../middlewares/authenticationMiddleware";
import getUserController from "../controllers/getUserController";

const router=Router();

router.get("/me",authenticationMiddleware,getUserController);

export default router;