import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecurringExpense, UserAccount, UserDetails } from "../types";

const initialState: UserDetails = {
  userId: 0,
  userPassword: "",
  userEmail: "",
  userGender: "",
  userBirthDate: "",
  userAge: 0,
  userCreatedAt: "",
  userUpdatedAt: "",
  enabled: false,
  accountNonExpired: false,
  accountNonLocked: false,
  credentialsNonExpired: false,
  authorities: [],
  userDisplayName: "",
  userAccounts: [],
  userRecurringExpenses: [],
};

export const userSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      // return { ...action.payload, userAccounts: [], userRecurringExpenses: [] };
      return action.payload;
    },
    addUserAccountToUserDetails: (
      state,
      action: PayloadAction<UserAccount>
    ) => {
      state.userAccounts.push({
        accountId: action.payload.accountId,
        accountName: action.payload.accountName,
        monthlyIncome: action.payload.monthlyIncome,
        userId: action.payload.userId,
        // accountTransactions: [],
        accountStatus: action.payload.accountStatus,
        accountBalance: action.payload.monthlyIncome,
      });
    },
    removeUserAccountById: (state, action: PayloadAction<string>) => {
      state.userAccounts = state.userAccounts.map((account: UserAccount) => {
        if (account.accountId === action.payload) {
          return { ...account, accountStatus: "inactive" };
        }
        return account;
      });
    },
    updateUserAccountDetails: (state, action: PayloadAction<UserAccount>) => {
      state.userAccounts = state.userAccounts.map((account) => {
        if (account.accountId === action.payload.accountId) {
          return action.payload;
        }
        return account;
      });
    },
    addRecurringExpenseToUserDetails: (
      state,
      action: PayloadAction<RecurringExpense>
    ) => {
      state.userRecurringExpenses.unshift(action.payload);
    },
    removeRecurringExpenseFromUserDetails: (
      state,
      action: PayloadAction<string>
    ) => {
      state.userRecurringExpenses = state.userRecurringExpenses.filter(
        (expense) => expense.recurringExpenseId !== action.payload
      );
    },
    updateRecurringExpenseDetails: (
      state,
      action: PayloadAction<RecurringExpense>
    ) => {
      state.userRecurringExpenses = state.userRecurringExpenses.map((expense) => {
        if (expense.recurringExpenseId === action.payload.recurringExpenseId) {
          return action.payload;
        }
        return expense;
      });
    },
  },
});

export const {
  setUserDetails,
  addUserAccountToUserDetails,
  removeUserAccountById,
  updateUserAccountDetails,
  addRecurringExpenseToUserDetails,
  removeRecurringExpenseFromUserDetails,
  updateRecurringExpenseDetails,
} = userSlice.actions;

export const selectUserDetails = (state: { userDetails: UserDetails }) => {
  return state.userDetails;
};

export default userSlice.reducer;
