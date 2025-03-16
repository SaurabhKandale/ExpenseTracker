package com.expensetracker.expensetracker.Repository;

import com.expensetracker.expensetracker.Dtos.AccountDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String accountId;

    @Column(nullable = false, unique = true)
    private String accountName;

    @Column(nullable = false)
    private double monthlyIncome;

    @Column(nullable = false)
    private double accountBalance;

    @Column(nullable = false)
    private String accountStatus="active";

    @JoinColumn (name = "user_id",  nullable = false)
    private String userId;

    @OneToMany(mappedBy = "accountId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Transaction> accountTransactions;

    public Account(AccountDto accountDto) {
        this.accountName = accountDto.getAccountName();
        this.monthlyIncome = accountDto.getMonthlyIncome();
        this.accountBalance=accountDto.getMonthlyIncome();
        this.userId=accountDto.getUserId();
        this.accountStatus="active";
        this.accountTransactions=new ArrayList<>();
    }


}
