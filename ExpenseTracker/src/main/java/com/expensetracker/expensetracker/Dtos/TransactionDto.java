package com.expensetracker.expensetracker.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionDto {
    private double transactionAmount;
    private String transactionCategory;
    private String accountId;
    private String transactionDate;
    private String transactionDescription;
    private String userId;
    private String transactionType;
    private String accountIdToWhichMoneyTransferred;
}
