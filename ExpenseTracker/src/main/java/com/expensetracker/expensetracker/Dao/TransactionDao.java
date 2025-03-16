package com.expensetracker.expensetracker.Dao;

import com.expensetracker.expensetracker.Repository.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TransactionDao extends JpaRepository<Transaction, String> {

    void deleteByTransactionId(String transactionId);

    @Query("select e from Transaction e where e.userId=:userId ORDER BY e.transactionDate ASC")
    Optional<List<Transaction>> getTransactionsByUserId(String userId);

    @Query("select e from Transaction e where EXTRACT(MONTH FROM TO_DATE(e.transactionDate, 'YYYY-MM-DD')) =EXTRACT(MONTH FROM TO_DATE(:monthAndYear, 'YYYY-MM-DD')) and EXTRACT(YEAR FROM TO_DATE(e.transactionDate, 'YYYY-MM-DD')) =EXTRACT(YEAR FROM TO_DATE(:monthAndYear, 'YYYY-MM-DD') ) and e.userId=:userId order by e.transactionDate desc")
    Optional<List<Transaction>> getMonthlyTransactionsGroupedByDate(String userId, String monthAndYear);

}
