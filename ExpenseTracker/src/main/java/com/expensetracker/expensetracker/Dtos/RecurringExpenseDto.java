package com.expensetracker.expensetracker.Dtos;

import lombok.Data;

@Data
public class RecurringExpenseDto {

    private String recurringExpenseTitle;
    private String recurringExpenseCategory;
    private double recurringExpenseAmount;
    private String recurringExpenseUserId;
    private String recurringExpenseAccountId;

}
