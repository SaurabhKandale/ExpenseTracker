package com.expensetracker.expensetracker.Dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MonthwiseTransaction {
    private String monthName;
    private double totalMonthlyExpenditure;
    private double totalMonthlyExtraIncome;
    private List<TransactionsGroupedByDate> transactionsGroupedByDate;
}
