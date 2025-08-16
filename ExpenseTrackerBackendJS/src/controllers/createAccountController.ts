import { Request, Response } from "express";
import createAccountService from "../services/createAccountService";

const createAccountController = (request: Request, response: Response) => {
   return createAccountService(request,response);
}

export default createAccountController;