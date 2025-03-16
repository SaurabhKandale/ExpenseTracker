package com.expensetracker.expensetracker.Controllers;

import com.expensetracker.expensetracker.Dtos.AccountDto;
import com.expensetracker.expensetracker.Repository.Account;
import com.expensetracker.expensetracker.Service.UserAccountsService;
import com.expensetracker.expensetracker.exceptions.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountController {

    private final UserAccountsService userAccountsService;

    public AccountController(UserAccountsService userAccountsService) {
        this.userAccountsService = userAccountsService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAccount(@RequestBody AccountDto accountDto) {
        return new ResponseEntity<>(userAccountsService.addUserAccount(accountDto), HttpStatus.CREATED);
    }

    @DeleteMapping("/remove/{accountId}")
    public ResponseEntity<?> removeAccount(@PathVariable String accountId) {
        try {
            userAccountsService.changeAccountStatusToInactive(accountId);
            return new ResponseEntity<>("Account removed successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateAccountDetails(@RequestBody Account account) {
        try {
            return new ResponseEntity<>(userAccountsService.updateAccountDetails(account), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
