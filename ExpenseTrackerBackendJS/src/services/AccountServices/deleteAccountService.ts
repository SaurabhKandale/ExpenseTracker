import { Request, Response } from "express";
import prisma from "../../lib/prisma";

const deleteAccountService=async (req:Request, res:Response)=>{
    const {accountId} = req.params;
    try{
        await prisma.account.update({
            where:{
                accountId:accountId
            },
            data:{
                accountStatus:"inactive"
            }
        })
        return res.status(200).json({message:"Account deleted successfully."});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error."})
    }
}

export default deleteAccountService;