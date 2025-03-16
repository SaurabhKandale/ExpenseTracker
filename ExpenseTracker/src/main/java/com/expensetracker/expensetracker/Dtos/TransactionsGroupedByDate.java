package com.expensetracker.expensetracker.Dtos;

import com.expensetracker.expensetracker.Repository.Transaction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TransactionsGroupedByDate {
    private String date;
    private double totalExpenditureOnDate;
    private double totalExtraIncomeOnDate;
    private List<Transaction> transactions;
}
