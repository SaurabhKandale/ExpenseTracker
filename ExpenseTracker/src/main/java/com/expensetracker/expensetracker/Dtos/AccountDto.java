package com.expensetracker.expensetracker.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountDto {

    private String accountName;
    private double monthlyIncome;
    private String userId;

}
