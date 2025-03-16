package com.expensetracker.expensetracker.exceptions;


import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.security.SignatureException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(CustomUserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUserAlreadyExistsException(CustomUserAlreadyExistsException e) {
        return new ErrorResponse(HttpStatus.CONFLICT.value(), e.getMessage());
    }

    @ExceptionHandler(CustomUserDoesNotExist.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUserDoesNotExistException(CustomUserDoesNotExist e) {
        return new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
    }

    @ExceptionHandler(AccountDoesNotExist.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleAccountDoesNotExistException(AccountDoesNotExist e) {
        return new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
    }

    @ExceptionHandler(AccountAlreadyExists.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ErrorResponse> handleAccountAlreadyExists(AccountAlreadyExists e) {
        return new ResponseEntity<>(new ErrorResponse(HttpStatus.CONFLICT.value(), e.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ErrorResponse handleException(Exception e) {
        if (e instanceof BadCredentialsException) {
            return new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Entered password is incorrect.");
        }
        if (e instanceof ExpiredJwtException) {
            return new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Expired JWT token.");
        }
        if(e instanceof AccountStatusException){
            return new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Account status error.");
        }
        if(e instanceof AccessDeniedException){
            return new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Access denied.");
        }
        if(e instanceof SignatureException
        ){
            return new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Signature error.");
        }

        return null;
    }

}
