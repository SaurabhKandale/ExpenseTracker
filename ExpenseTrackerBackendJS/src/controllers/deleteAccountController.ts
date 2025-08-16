import { Request, Response } from "express";
import deleteAccountService from "../services/deleteAccountService";

const deleteAccountController=(req:Request, res:Response)=>{
    return deleteAccountService(req,res);
}

export default deleteAccountController;