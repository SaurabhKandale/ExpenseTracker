package com.expensetracker.expensetracker.exceptions;

public class CustomUserAlreadyExistsException extends RuntimeException{
    public CustomUserAlreadyExistsException(String message) {
        super(message);
    }
}
