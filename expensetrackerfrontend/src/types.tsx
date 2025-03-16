export interface UserSignUpRequest {
  username: string;
  email: string;
  password: string;
  gender: string;
  birthDate: string;
}

export interface UserSignInResponse {
  token: string;
  expirationTime: BigInteger;
}

export interface UserDetails {
  userId: number;
  userDisplayName: string;
  userPassword: string;
  userEmail: string;
  userGender: string;
  userBirthDate: string;
  userAge: number;
  userCreatedAt: string;
  userUpdatedAt: string;
  enabled: boolean;
  authorities: any[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  userAccounts: UserAccount[];
  userRecurringExpenses: RecurringExpense[];
}

export interface UserAccount {
  accountId: string;
  accountName: string;
  monthlyIncome: number;
  userId: number;
  // accountTransactions: Transaction[];
  accountStatus: String;
  accountBalance: number;
}

export interface MonthwiseTransactions {
  monthName: string;
  totalMonthlyExpenditure: number;
  transactionsGroupedByDate: TransactionsGroupedByDate[];
  totalMonthlyExtraIncome: number;
}

export interface TransactionsGroupedByDate {
  date: string;
  totalExpenditureOnDate: number;
  totalExtraIncomeOnDate: number;
  transactions: Transaction[];
}

export interface Transaction {
  transactionId: string;
  transactionAmount: number;
  transactionCategory: string;
  transactionDescription: string;
  transactionDate: string;
  accountId: string;
  userId: number;
  transactionType: "DEBIT" | "TRANSFER" | "CREDIT";
  accountIdToWhichMoneyTransferred: string;
}

export interface RecurringExpense {
  recurringExpenseId: string;
  recurringExpenseTitle: string;
  recurringExpenseCategory: string;
  recurringExpenseAccountId: string;
  recurringExpenseAmount: number;
  userId: string;
}
