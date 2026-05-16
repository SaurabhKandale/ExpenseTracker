import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Transaction } from "../../types";
import getTransactionDetailsService from "./getTransactionDetailsService";
import getAccountDetailsService from "../AccountServices/getAccountDetailsService";
import updateAccountBalanceService from "../AccountServices/updateAccountBalanceService";

const reverseAccountBalancesAfterTransactionRemoval = async (
  transaction: Transaction
) => {
  if (transaction.transactionType === "DEBIT") {
    const account = await getAccountDetailsService(transaction.accountId);
    if (!account) throw new Error("Account not found");
    await updateAccountBalanceService(
      account.accountId,
      account.accountBalance + transaction.transactionAmount
    );
  } else if (transaction.transactionType === "CREDIT") {
    const account = await getAccountDetailsService(
      transaction.accountIdToWhichMoneyTransferred
    );
    if (!account) throw new Error("Account not found");
    await updateAccountBalanceService(
      account.accountId,
      account.accountBalance - transaction.transactionAmount
    );
  } else {
    const fromAccount = await getAccountDetailsService(transaction.accountId);
    const toAccount = await getAccountDetailsService(
      transaction.accountIdToWhichMoneyTransferred
    );
    if (!fromAccount || !toAccount) throw new Error("Account not found");
    await updateAccountBalanceService(
      toAccount.accountId,
      toAccount.accountBalance - transaction.transactionAmount
    );
    await updateAccountBalanceService(
      fromAccount.accountId,
      fromAccount.accountBalance + transaction.transactionAmount
    );
  }
};

const removeTransactionService = async (req: Request, res: Response) => {
  const transactionId = req.params.transactionId;
  const existingTransaction =
    await getTransactionDetailsService(transactionId);
  if (!existingTransaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  try {
    await reverseAccountBalancesAfterTransactionRemoval(existingTransaction);
    await prisma.transaction.delete({
      where: { transactionId },
    });
    return res
      .status(200)
      .json({ message: "Transaction removed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default removeTransactionService;
