import { Request, Response } from "express";
import prisma from "../../lib/prisma";

const createAccountService = async (request: Request, response: Response) => {
    const { accountName, monthlyIncome } = request.body;
    const userId = request.user?.userId;

    if (!userId) {
        return response.status(401).json({ message: "Unauthorized" });
    }
    try{
        const account = await prisma.account.create({
            data:{
                accountName,
                monthlyIncome:parseFloat(monthlyIncome),
                accountBalance:parseFloat(monthlyIncome),
                accountStatus:"active",
                userId
            }
        })
        return response.status(201).json(account);
    }catch(error){
        console.log(error);
        return response.status(500).json({message:"Internal server error"});
    }
}

export default createAccountService;