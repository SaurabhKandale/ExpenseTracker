import { Request, Response } from "express";
import getUserService from "../services/getUserService";

const getUserController=(request: Request,response: Response)=>{
    return getUserService(request,response);
}

export default getUserController;