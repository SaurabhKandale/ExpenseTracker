package com.expensetracker.expensetracker.Service;


import com.expensetracker.expensetracker.Dao.AccountDao;
import com.expensetracker.expensetracker.Dao.TransactionDao;
import com.expensetracker.expensetracker.Dtos.DeleteResponse;
import com.expensetracker.expensetracker.Dtos.TransactionDto;
import com.expensetracker.expensetracker.Dtos.MonthwiseTransaction;
import com.expensetracker.expensetracker.Dtos.TransactionsGroupedByDate;
import com.expensetracker.expensetracker.Repository.Account;
import com.expensetracker.expensetracker.Repository.Transaction;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionDao transactionDao;
    private final UserAccountsService userAccountsService;

    public TransactionService(TransactionDao transactionDao, AccountDao accountDao, UserAccountsService userAccountsService) {
        this.transactionDao = transactionDao;
        this.userAccountsService = userAccountsService;
    }

    private String getMonthName(List<Transaction> expenses, String monthANdYear) {
        if (expenses.isEmpty()) {
            return LocalDate.parse(monthANdYear).getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + ", " + LocalDate.parse(monthANdYear).getYear();
        } else {
            String formattedDate = getDateFormatted(expenses.get(0).getTransactionDate());
            return LocalDate.parse(formattedDate).getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + ", " + LocalDate.parse(formattedDate).getYear();
        }
    }

    private String getDateFormatted(String date) {
        DateTimeFormatter inputFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime dateTime = LocalDateTime.parse(date, inputFormatter);
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return dateTime.format(outputFormatter);
    }

    private MonthwiseTransaction getMonthwiseTransactions(List<Transaction> transactions, String monthAndYear) {

        if (transactions.isEmpty()) {
            return new MonthwiseTransaction(getMonthName(List.of(), monthAndYear), 0, 0, List.of());
        }

        List<TransactionsGroupedByDate> transactionsDoneOnADay = new ArrayList<>(transactions.stream().collect(Collectors.groupingBy(Transaction -> {
            return getDateFormatted(Transaction.getTransactionDate());
        })).entrySet().stream().map(entry -> {
            String date = entry.getKey();
            List<Transaction> dailyTransactions = entry.getValue();
            Double totalExtraIncome = 0.0, totalTransaction = 0.0;

            for (Transaction transaction : dailyTransactions) {
                if (transaction.getTransactionType().equals("DEBIT")) {
                    totalTransaction += transaction.getTransactionAmount();
                } else if (transaction.getTransactionType().equals("CREDIT")) {
                    totalExtraIncome += transaction.getTransactionAmount();
                }
            }


            return new TransactionsGroupedByDate(date, totalTransaction, totalExtraIncome, dailyTransactions);
        }).toList());

        transactionsDoneOnADay.sort(Comparator.comparing(TransactionsGroupedByDate::getDate).reversed());

        double totalTransactionInAMonthAmount = 0.0, totalExtraIncomeInAMonthAmount = 0.0;
        for (Transaction transaction : transactions) {
            if (transaction.getTransactionType().equals("DEBIT")) {
                totalTransactionInAMonthAmount += transaction.getTransactionAmount();
            } else if (transaction.getTransactionType().equals("CREDIT")) {
                totalExtraIncomeInAMonthAmount += transaction.getTransactionAmount();
            }
        }
        String monthName = getMonthName(transactions, monthAndYear);

        return new MonthwiseTransaction(monthName, totalTransactionInAMonthAmount, totalExtraIncomeInAMonthAmount, transactionsDoneOnADay);

    }


    public Transaction addNewTransaction(TransactionDto newTransaction) {
        Transaction transactionMade = new Transaction(newTransaction);
        if (!newTransaction.getTransactionType().equals("CREDIT")) {
            Account usedAccount = userAccountsService.getAccountById(newTransaction.getAccountId());
            usedAccount.setAccountBalance(usedAccount.getAccountBalance() - newTransaction.getTransactionAmount());
            userAccountsService.updateAccountDetails(usedAccount);
        }
        if (newTransaction.getTransactionType().equals("CREDIT") || newTransaction.getTransactionType().equals("TRANSFER")) {
            Account addedIncomeOrTransferredMoneyAccount = userAccountsService.getAccountById(transactionMade.getAccountIdToWhichMoneyTransferred());
            addedIncomeOrTransferredMoneyAccount.setAccountBalance(addedIncomeOrTransferredMoneyAccount.getAccountBalance() + newTransaction.getTransactionAmount());
            userAccountsService.updateAccountDetails(addedIncomeOrTransferredMoneyAccount);
        }

        return transactionDao.save(transactionMade);
    }

    public MonthwiseTransaction getMonthwiseTransactionsByUserId(String userId, String monthAndYear) {
        List<Transaction> transactions = transactionDao
                .getMonthlyTransactionsGroupedByDate(userId, monthAndYear)
                .orElse(Collections.emptyList());
        return getMonthwiseTransactions(transactions, monthAndYear);
    }

    @Transactional
    public Transaction updateTransaction(Transaction updatedTransactionDetails) {

        Transaction existingTransaction = transactionDao.findById(updatedTransactionDetails.getTransactionId()).orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (existingTransaction.getTransactionType().equals("DEBIT")) {
            Account usedAccount = userAccountsService.getAccountById(existingTransaction.getAccountId());
            usedAccount.setAccountBalance(usedAccount.getAccountBalance() + existingTransaction.getTransactionAmount());
            if (!Objects.equals(existingTransaction.getAccountId(), updatedTransactionDetails.getAccountId())) {
                Account newLinkedAccount = userAccountsService.getAccountById(updatedTransactionDetails.getAccountId());
                newLinkedAccount.setAccountBalance(newLinkedAccount.getAccountBalance() - updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(newLinkedAccount);
            } else {
                usedAccount.setAccountBalance(usedAccount.getAccountBalance() - updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(usedAccount);
            }
        }
        else if(existingTransaction.getTransactionType().equals("CREDIT")){
            Account usedAccount = userAccountsService.getAccountById(existingTransaction.getAccountIdToWhichMoneyTransferred());
            usedAccount.setAccountBalance(usedAccount.getAccountBalance() - existingTransaction.getTransactionAmount());
            if(!usedAccount.getAccountId().equals(updatedTransactionDetails.getAccountIdToWhichMoneyTransferred())){
                Account newLinkedAccount = userAccountsService.getAccountById(updatedTransactionDetails.getAccountIdToWhichMoneyTransferred());
                newLinkedAccount.setAccountBalance(newLinkedAccount.getAccountBalance() + updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(newLinkedAccount);
            }
            else{
                usedAccount.setAccountBalance(usedAccount.getAccountBalance() + updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(usedAccount);
            }
        }
        else{
            Account oldFromAccount= userAccountsService.getAccountById(existingTransaction.getAccountId());
            oldFromAccount.setAccountBalance(oldFromAccount.getAccountBalance()+ existingTransaction.getTransactionAmount());
            Account oldToAccount= userAccountsService.getAccountById(existingTransaction.getAccountIdToWhichMoneyTransferred());
            oldToAccount.setAccountBalance(oldToAccount.getAccountBalance()- existingTransaction.getTransactionAmount());
            if(!oldFromAccount.getAccountId().equals(updatedTransactionDetails.getAccountId())){
                Account newFromAccount = userAccountsService.getAccountById(updatedTransactionDetails.getAccountId());
                newFromAccount.setAccountBalance(newFromAccount.getAccountBalance() - updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(newFromAccount);
            }
            else{
                oldFromAccount.setAccountBalance(oldFromAccount.getAccountBalance() - updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(oldFromAccount);
            }
            if(!oldToAccount.getAccountId().equals(updatedTransactionDetails.getAccountIdToWhichMoneyTransferred())){
                Account newToAccount= userAccountsService.getAccountById(updatedTransactionDetails.getAccountIdToWhichMoneyTransferred());
                newToAccount.setAccountBalance(newToAccount.getAccountBalance() + updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(newToAccount);
            }
            else{
                oldToAccount.setAccountBalance(oldToAccount.getAccountBalance() + updatedTransactionDetails.getTransactionAmount());
                userAccountsService.updateAccountDetails(oldToAccount);
            }
        }


        return transactionDao.save(updatedTransactionDetails);

    }

    public Transaction getTransactionByTransactionId(String transactionId) {
        return transactionDao.findById(transactionId).orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    @Transactional
    public DeleteResponse removeTransaction(String transactionId) {
        Transaction transactionDetails = getTransactionByTransactionId(transactionId);

        if (transactionDetails.getTransactionType().equals("DEBIT")) {
            Account accountUsedForTransaction = userAccountsService.getAccountById(transactionDetails.getAccountId());
            accountUsedForTransaction.setAccountBalance(accountUsedForTransaction.getAccountBalance() + transactionDetails.getTransactionAmount());
            accountUsedForTransaction.getAccountTransactions().remove(transactionDetails);
            userAccountsService.updateAccountDetails(accountUsedForTransaction);
        } else if (transactionDetails.getTransactionType().equals("CREDIT")) {
            Account accountUsedToAddMoney = userAccountsService.getAccountById(transactionDetails.getAccountIdToWhichMoneyTransferred());
            accountUsedToAddMoney.setAccountBalance(accountUsedToAddMoney.getAccountBalance() - transactionDetails.getTransactionAmount());
            userAccountsService.updateAccountDetails(accountUsedToAddMoney);
        } else {
            Account accountFromWhichMoneyTransferred = userAccountsService.getAccountById(transactionDetails.getAccountId());
            Account accountToWhichMoneyTransferred = userAccountsService.getAccountById(transactionDetails.getAccountIdToWhichMoneyTransferred());

            accountToWhichMoneyTransferred.setAccountBalance(accountToWhichMoneyTransferred.getAccountBalance() - transactionDetails.getTransactionAmount());
            accountFromWhichMoneyTransferred.setAccountBalance(accountFromWhichMoneyTransferred.getAccountBalance() + transactionDetails.getTransactionAmount());
            accountFromWhichMoneyTransferred.getAccountTransactions().remove(transactionDetails);
            userAccountsService.updateAccountDetails(accountFromWhichMoneyTransferred);
            userAccountsService.updateAccountDetails(accountToWhichMoneyTransferred);
        }
        transactionDao.deleteByTransactionId(transactionId);
        return new DeleteResponse("Transaction removed successfully.");
    }
}
