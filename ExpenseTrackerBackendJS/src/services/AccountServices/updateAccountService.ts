import {Request, Response} from "express";
import { Account } from "../../types";
import prisma from "../../lib/prisma";

const updateAccountService=async (request:Request, response: Response)=>{
    const {accountId} = request.params;
    const {accountName, monthlyIncome} = request.body;
    try{
        const account:Account= await prisma.account.update({
            where:{
                accountId
            },
            data:{
                accountName,
                monthlyIncome:parseFloat(monthlyIncome),
            }
        })

        return response.status(200).json(account);
    }catch(error){
        console.log(error);
        return response.status(500).json({message:"Internal server error"});
    }

    
}

export default updateAccountService;