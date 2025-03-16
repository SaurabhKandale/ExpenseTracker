package com.expensetracker.expensetracker.Repository;

import com.expensetracker.expensetracker.Dtos.TransactionDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String transactionId;

    @Column(nullable = false)
    private double transactionAmount;

    @Column(nullable = false)
    private String transactionCategory;

    private String transactionDescription;

    @Column(nullable = false)
    private String transactionDate;

    @JoinColumn(name = "account_id", nullable = false)
    private String accountId;

    private String accountIdToWhichMoneyTransferred;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String transactionType;

    public Transaction(TransactionDto transactionDto) {
        this.transactionAmount=transactionDto.getTransactionAmount();
        this.transactionCategory=transactionDto.getTransactionCategory();
        this.transactionDescription=transactionDto.getTransactionDescription();
        this.transactionDate=transactionDto.getTransactionDate();
        this.accountId=transactionDto.getAccountId();
        this.userId=transactionDto.getUserId();
        this.transactionType=transactionDto.getTransactionType();
        this.accountIdToWhichMoneyTransferred=transactionDto.getAccountIdToWhichMoneyTransferred();
    }

    
}
