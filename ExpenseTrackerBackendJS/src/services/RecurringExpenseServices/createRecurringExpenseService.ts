import {Request, Response} from 'express'
import prisma from '../../lib/prisma';
import { RecurringExpense } from '../../types';


const createRecurringExpenseService= async (req:Request, res:Response)=>{
    const {recurringExpenseTitle, recurringExpenseCategory, recurringExpenseAccountId, recurringExpenseAmount}=req.body;
    if(!recurringExpenseTitle || !recurringExpenseCategory || !recurringExpenseAccountId || !recurringExpenseAmount){
        return res.status(400).json({message:"Bad request"});
    }

    try{
        const recurringExpense:RecurringExpense=await prisma.recurringExpense.create({
            data:{
            recurringExpenseAccountId,
            recurringExpenseAmount,
            recurringExpenseCategory,
            recurringExpenseTitle,
            userId:req.user?.userId || ""
            }
        })

        return res.status(200).json(recurringExpense);

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});     
    }
    
}

export default createRecurringExpenseService;