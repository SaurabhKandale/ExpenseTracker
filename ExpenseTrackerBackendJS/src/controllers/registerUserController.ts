import { Request, Response } from "express";
import registerUserService from "../services/registerUserService";

const registerUserController= (request:Request, response:Response)=>{
return registerUserService(request, response);
}

export default registerUserController;