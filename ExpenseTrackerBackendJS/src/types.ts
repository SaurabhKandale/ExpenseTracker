export interface UserRegisterRequest {
  username: string;
  birthDate: string;
  email: string;
  password: string;
  gender: string;
}

export interface UserData {
  userId: string;
  userDisplayName: string;
  userEmail: string;
  userGender: string;
  userAge: number;
  userBirthDate: string;
  userCreatedAt: string;
  userUpdatedAt: string;
  userPassword: string;
  userAccounts: Account[];
}

export interface Account {
  accountId: string;
  accountName: string;
  userId: string;
  monthlyIncome: number;
  accountBalance: number;
  accountStatus: string;
}

export interface RecurringExpense {
  recurringExpenseId: string;
  recurringExpenseTitle: string;
  recurringExpenseCategory: string;
  recurringExpenseAccountId: string;
  recurringExpenseAmount: number;
  userId: string;
}

export interface TransactionWithoutId {
  transactionAmount: number;
  transactionCategory: string;
  transactionDescription: string;
  transactionDate: string;
  accountId: string;
  accountIdToWhichMoneyTransferred: string;
  userId: string;
  transactionType: string;
}

export interface Transaction extends TransactionWithoutId {
  transactionId: string;
}

export interface TransactionsGroupedByDate {
  date: string;
  totalExpenditureOnDate: number;
  totalExtraIncomeOnDate: number;
  transactions: Transaction[];
}

export interface MonthwiseTransactions {
  monthName: string;
  totalMonthlyExpenditure: number;
  totalMonthlyExtraIncome: number;
  transactionsGroupedByDate: TransactionsGroupedByDate[];
}
