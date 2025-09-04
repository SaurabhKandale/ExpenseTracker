import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Transaction } from "../../types";
import { Account } from "../../types";
import getAccountDetailsService from "../AccountServices/getAccountDetailsService";
import updateAccountBalanceService from "../AccountServices/updateAccountBalanceService";

export const updateAccountDetails = async (transactionDetails: Transaction) => {
  const accountDetails: Account | null = await getAccountDetailsService(
    transactionDetails.transactionType === "CREDIT"
      ? transactionDetails.accountIdToWhichMoneyTransferred
      : transactionDetails.accountId
  );
  if (!accountDetails) {
    throw new Error("Account not found");
  }
  if (
    transactionDetails.transactionType === "DEBIT"
  ) {
    accountDetails.accountBalance -= transactionDetails.transactionAmount;
  } else if (transactionDetails.transactionType === "CREDIT") {
    accountDetails.accountBalance += transactionDetails.transactionAmount;
  } else {
    accountDetails.accountBalance -= transactionDetails.transactionAmount;
    const amountCreditedAccount: Account | null =
      await getAccountDetailsService(
        transactionDetails.accountIdToWhichMoneyTransferred
      );
    if (!amountCreditedAccount) {
      throw new Error("Account not found");
    }
    const updatedBalance=amountCreditedAccount.accountBalance +
      transactionDetails.transactionAmount;
    const result = await updateAccountBalanceService(
      amountCreditedAccount.accountId,
      updatedBalance
    );
    if (!result) {
      throw new Error("Error updating account balance");
    }
  }

  const result = await updateAccountBalanceService(
    accountDetails.accountId,
    accountDetails.accountBalance
  );
  if (!result) {
    throw new Error("Error updating account balance");
  }
};

const createTransactionService = async (req: Request, res: Response) => {
  const transactionDetails = req.body;
  const user = req.user;
  try {
    const transactionToSave: Transaction = await prisma.transaction.create({
      data: {
        transactionAmount: parseFloat(transactionDetails.transactionAmount),
        transactionCategory: transactionDetails.transactionCategory,
        transactionDescription: transactionDetails.transactionDescription,
        transactionDate: transactionDetails.transactionDate,
        accountId: transactionDetails.accountId,
        accountIdToWhichMoneyTransferred:
          transactionDetails.accountIdToWhichMoneyTransferred,
        userId: user?.userId || "",
        transactionType: transactionDetails.transactionType,
      },
    });
    await updateAccountDetails(transactionToSave);

    return res.status(201).json(transactionToSave);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default createTransactionService;
