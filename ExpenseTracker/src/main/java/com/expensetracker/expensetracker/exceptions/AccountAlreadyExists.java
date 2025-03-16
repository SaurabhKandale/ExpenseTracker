package com.expensetracker.expensetracker.exceptions;

public class AccountAlreadyExists extends RuntimeException {
    public AccountAlreadyExists(String message) {
        super(message);
    }
}
