import { Request, Response } from "express";
import loginUserService from "../services/loginUserService";

const loginUserController = (request:Request,response:Response)=>{
    return loginUserService(request,response);
}

export default loginUserController;