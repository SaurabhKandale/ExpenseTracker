import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MonthwiseTransactions, Transaction } from "../types";
import { convertFirstLetterToCapital } from "../utils";

const initialState: MonthwiseTransactions = {
  monthName: "",
  totalMonthlyExpenditure: 0,
  totalMonthlyExtraIncome: 0,
  transactionsGroupedByDate: [],
};

export const transactionSlice = createSlice({
  name: "monthwiseTransations",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      const getMonthName = (date: string) => {
        const month = new Date(date).toLocaleString("en-IN", { month: "long" });
        const year = new Date(date).getFullYear();
        return convertFirstLetterToCapital(month) + ", " + year;
      };
      if (state.monthName === getMonthName(action.payload.transactionDate)) {
        if (action.payload.transactionType === "CREDIT") {
          state.totalMonthlyExtraIncome += action.payload.transactionAmount;
        } else if (action.payload.transactionType === "DEBIT") {
          state.totalMonthlyExpenditure += action.payload.transactionAmount;
        }
        let isDatePresent = false;
        state.transactionsGroupedByDate.map((transaction) => {
          if (
            transaction.date === action.payload.transactionDate.substring(0, 10)
          ) {
            transaction.transactions.unshift(action.payload);
            if (action.payload.transactionType === "CREDIT") {
              transaction.totalExtraIncomeOnDate +=
                action.payload.transactionAmount;
            } else if (action.payload.transactionType === "DEBIT") {
              transaction.totalExpenditureOnDate +=
                action.payload.transactionAmount;
            }
            isDatePresent = true;
          }
          return transaction;
        });
        if (!isDatePresent) {
          state.transactionsGroupedByDate.unshift({
            date: action.payload.transactionDate.substring(0, 10),
            totalExpenditureOnDate:
              action.payload.transactionType === "DEBIT"
                ? action.payload.transactionAmount
                : 0,
            transactions: [action.payload],
            totalExtraIncomeOnDate:
              action.payload.transactionType === "CREDIT"
                ? action.payload.transactionAmount
                : 0,
          });
        }
      }
    },
    removeTransaction: (state, action: PayloadAction<Transaction>) => {
      action.payload.transactionType === "DEBIT" &&
        (state.totalMonthlyExpenditure -= action.payload.transactionAmount);
      action.payload.transactionType === "CREDIT" &&
        (state.totalMonthlyExtraIncome -= action.payload.transactionAmount);
      state.transactionsGroupedByDate.map((transaction) => {
        if (
          transaction.date === action.payload.transactionDate.substring(0, 10)
        ) {
          transaction.transactions = transaction.transactions.filter(
            (transaction) =>
              transaction.transactionId !== action.payload.transactionId
          );
          if (action.payload.transactionType === "CREDIT") {
            transaction.totalExtraIncomeOnDate -=
              action.payload.transactionAmount;
          } else if (action.payload.transactionType === "DEBIT") {
            transaction.totalExpenditureOnDate -=
              action.payload.transactionAmount;
          }
        }
        return transaction;
      });
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactionsGroupedByDate.map((transaction) => {
        if (
          transaction.date === action.payload.transactionDate.substring(0, 10)
        ) {
          transaction.transactions = transaction.transactions.map(
            (singleTransaction) => {
              if (
                singleTransaction.transactionId === action.payload.transactionId
              ) {
                transaction.totalExpenditureOnDate =
                  singleTransaction.transactionType === "DEBIT"
                    ? transaction.totalExpenditureOnDate -
                      singleTransaction.transactionAmount +
                      action.payload.transactionAmount
                    : transaction.totalExpenditureOnDate;
                transaction.totalExtraIncomeOnDate =
                  singleTransaction.transactionType === "CREDIT"
                    ? transaction.totalExtraIncomeOnDate -
                      singleTransaction.transactionAmount +
                      action.payload.transactionAmount
                    : transaction.totalExtraIncomeOnDate;
                state.totalMonthlyExpenditure =
                  singleTransaction.transactionType === "DEBIT"
                    ? state.totalMonthlyExpenditure -
                      singleTransaction.transactionAmount +
                      action.payload.transactionAmount
                    : state.totalMonthlyExpenditure;
                state.totalMonthlyExtraIncome =
                  singleTransaction.transactionType === "CREDIT"
                    ? state.totalMonthlyExtraIncome -
                      singleTransaction.transactionAmount +
                      action.payload.transactionAmount
                    : state.totalMonthlyExtraIncome;

                singleTransaction.transactionAmount =
                  action.payload.transactionAmount;
                singleTransaction.transactionCategory =
                  action.payload.transactionCategory;
                singleTransaction.transactionDescription =
                  action.payload.transactionDescription;
                singleTransaction.transactionDate =
                  action.payload.transactionDate;
                singleTransaction.accountId = action.payload.accountId;
                singleTransaction.userId = action.payload.userId;
                singleTransaction.transactionType =
                  action.payload.transactionType;
                singleTransaction.accountIdToWhichMoneyTransferred =
                  action.payload.accountIdToWhichMoneyTransferred;
              }
              return singleTransaction;
            }
          );
        }
        return transaction;
      });
    },
    addMonthwiseTransactions: (
      state,
      action: PayloadAction<MonthwiseTransactions>
    ) => {
      return action.payload;
    },
  },
});

export const {
  addTransaction,
  removeTransaction,
  updateTransaction,
  addMonthwiseTransactions,
} = transactionSlice.actions;

export const getMonthwiseTransactions = (state: {
  transactions: MonthwiseTransactions;
}) => {
  return state.transactions;
};

export default transactionSlice.reducer;
