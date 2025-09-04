import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import {
  Transaction,
  TransactionsGroupedByDate,
  MonthwiseTransactions,
} from "../../types";

const groupTransactionByDate = (
  transactions: Transaction[]
): TransactionsGroupedByDate[] => {
  const transactionsGroupedByDate: TransactionsGroupedByDate[] = [];
  transactions.map((transaction) => {
    const date = transaction.transactionDate.split("T")[0];
    const existingGroup = transactionsGroupedByDate.find(
      (group) => group.date === date
    );
    if (existingGroup) {
      existingGroup.transactions.push(transaction);
      if (transaction.transactionType === "DEBIT") {
        existingGroup.totalExpenditureOnDate += transaction.transactionAmount;
      } else if (transaction.transactionType === "CREDIT") {
        existingGroup.totalExtraIncomeOnDate += transaction.transactionAmount;
      }
    } else {
      transactionsGroupedByDate.push({
        date: date,
        totalExpenditureOnDate:
          transaction.transactionType === "DEBIT"
            ? transaction.transactionAmount
            : 0,
        totalExtraIncomeOnDate:
          transaction.transactionType === "CREDIT"
            ? transaction.transactionAmount
            : 0,
        transactions: [transaction],
      });
    }
  });
  return transactionsGroupedByDate;
};

const getMonthNameAndYear = (date: string): string => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = parseInt(date.split("-")[1]);
  const year = parseInt(date.split("-")[0]);
  const monthName = monthNames[month - 1];
  return `${monthName}, ${year}`;
};

const getTransactionsHappenedInAMonth = async (
  date: string
): Promise<MonthwiseTransactions> => {
  const year = parseInt(date.split("-")[0]);
  const month = parseInt(date.split("-")[1]);
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const transactions = await prisma.transaction.findMany({
    where: {
      transactionDate: {
        gte: startDate,
        lt: endDate,
      },
    },
  });
  let totalAmountSpentInAMonth = 0,
    totalAmountReceivedInAMonth = 0;
  transactions.map((transaction) => {
    if (transaction.transactionType === "DEBIT") {
      totalAmountSpentInAMonth += transaction.transactionAmount;
    } else if (transaction.transactionType === "CREDIT") {
      totalAmountReceivedInAMonth += transaction.transactionAmount;
    }
  });
  const transactionsGroupedByDate = groupTransactionByDate(transactions);
  return {
    monthName: getMonthNameAndYear(date),
    totalMonthlyExpenditure: totalAmountSpentInAMonth,
    totalMonthlyExtraIncome: totalAmountReceivedInAMonth,
    transactionsGroupedByDate: transactionsGroupedByDate,
  };
};

const getTransationsService = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const currentDate = req.params.date;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const transactions = await getTransactionsHappenedInAMonth(currentDate);
    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getTransationsService;
