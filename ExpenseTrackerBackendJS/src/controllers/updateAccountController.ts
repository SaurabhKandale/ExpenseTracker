import {Request,Response} from 'express'
import updateAccountService from '../services/updateAccountService'

const updateAccountController=(req:Request, res:Response)=>{
    return updateAccountService(req,res);
}

export default updateAccountController;