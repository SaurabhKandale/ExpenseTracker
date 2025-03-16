package com.expensetracker.expensetracker.exceptions;

public class CustomUserDoesNotExist extends RuntimeException {
    public CustomUserDoesNotExist(String message) {
        super(message);
    }
}
