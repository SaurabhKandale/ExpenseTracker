import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Transaction } from "../../types";
import getTransactionDetailsService from "./getTransactionDetailsService";
import getAccountDetailsService from "../AccountServices/getAccountDetailsService";
import updateAccountBalanceService from "../AccountServices/updateAccountBalanceService";

const updateAccountBalanceForMoneyTransfer = async (oldTransaction: Transaction, newTransaction: Transaction)=>{
  const differenceInAmounts =newTransaction.transactionAmount - oldTransaction.transactionAmount;
  const oldMoneyAddedAccount = await getAccountDetailsService(oldTransaction.accountIdToWhichMoneyTransferred);
  if (!oldMoneyAddedAccount) {
    throw new Error("Account not found");
  }
  if(
    oldTransaction.accountIdToWhichMoneyTransferred !== newTransaction.accountIdToWhichMoneyTransferred
  ){
    const newMoneyAddedAccount = await getAccountDetailsService(newTransaction.accountIdToWhichMoneyTransferred);
    if (!newMoneyAddedAccount) {
      throw new Error("Account not found");
    }
    updateAccountBalanceService(
      oldMoneyAddedAccount.accountId,
      oldMoneyAddedAccount.accountBalance - oldTransaction.transactionAmount
    );
    updateAccountBalanceService(
      newMoneyAddedAccount.accountId,
      newMoneyAddedAccount.accountBalance + newTransaction.transactionAmount
    );
  } else {
    updateAccountBalanceService(
      oldMoneyAddedAccount.accountId,
      oldMoneyAddedAccount.accountBalance + differenceInAmounts
    );
  }
  
}

const updateAccountDetailsAfterTransactionUpdate = async (
  oldTransaction: Transaction,
  newTransaction: Transaction
) => {
  const differenceInAmounts =
    newTransaction.transactionAmount - oldTransaction.transactionAmount;
  const oldAccount = await getAccountDetailsService(oldTransaction.accountId);
  if (!oldAccount) throw new Error("Account not found");
  if (oldTransaction.accountId !== newTransaction.accountId) {
    const newAccount = await getAccountDetailsService(newTransaction.accountId);
    if (!newAccount) {
      throw new Error("Account not found");
    }
    updateAccountBalanceService(
      oldAccount.accountId,
      oldTransaction.transactionType === "DEBIT"
        ? oldAccount.accountBalance + oldTransaction.transactionAmount
        : oldAccount.accountBalance - oldTransaction.transactionAmount
    );
    updateAccountBalanceService(
      newAccount.accountId,
      newTransaction.transactionType === "DEBIT"
        ? newAccount.accountBalance - newTransaction.transactionAmount
        : newAccount.accountBalance + newTransaction.transactionAmount
    );
    if (oldTransaction.transactionType === "TRANSFER") {
      await updateAccountBalanceForMoneyTransfer(oldTransaction, newTransaction);
    }
  } else {
    updateAccountBalanceService(
      oldAccount.accountId,
      oldTransaction.transactionType === "DEBIT" ||
        oldTransaction.transactionType === "TRANSFER"
        ? oldAccount.accountBalance - differenceInAmounts
        : oldAccount.accountBalance + differenceInAmounts
    );
    if (oldTransaction.transactionType === "TRANSFER") {
      await updateAccountBalanceForMoneyTransfer(oldTransaction, newTransaction);
    }
  }
};

const updateTransactionService = async (req: Request, res: Response) => {
  const transactionId = req.params.transactionId;
  const updatedTransaction: Transaction = { ...req.body, transactionId };
  const existingTransaction: Transaction | null =
    await getTransactionDetailsService(transactionId);
  if (!existingTransaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  try {
    const updatedTransactionDetails: Transaction =
      await prisma.transaction.update({
        where: {
          transactionId: updatedTransaction.transactionId,
        },
        data: {
          ...updatedTransaction,
        },
      });

    await updateAccountDetailsAfterTransactionUpdate(
      existingTransaction,
      updatedTransaction
    );
    return res.status(200).json(updatedTransactionDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default updateTransactionService;
