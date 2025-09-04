import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { updateAccountDetails } from "../TransactionServices/createTransactionService";

const createIncomeService = async (req: Request, res: Response) => {
  try {
    const incomeTransaction = await prisma.transaction.create({
      data: {
        ...req.body,
      },
    });
    await updateAccountDetails(incomeTransaction);
    return res.status(201).json(incomeTransaction);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default createIncomeService;
