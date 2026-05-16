package com.expensetracker.expensetracker.Controllers;

import com.expensetracker.expensetracker.Dtos.AccountDto;
import com.expensetracker.expensetracker.Repository.Account;
import com.expensetracker.expensetracker.Repository.User;
import com.expensetracker.expensetracker.Service.UserAccountsService;
import com.expensetracker.expensetracker.Service.UserService;
import com.expensetracker.expensetracker.exceptions.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/account")
public class AccountController {

    private final UserAccountsService userAccountsService;
    private final UserService userService;

    public AccountController(UserAccountsService userAccountsService, UserService userService) {
        this.userAccountsService = userAccountsService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> addAccount(@RequestBody AccountDto accountDto) {
        User user = userService.getUserDetails();
        accountDto.setUserId(user.getUserId());
        return new ResponseEntity<>(userAccountsService.addUserAccount(accountDto), HttpStatus.CREATED);
    }

    @PutMapping("/remove/{accountId}")
    public ResponseEntity<?> removeAccount(@PathVariable String accountId) {
        try {
            userAccountsService.changeAccountStatusToInactive(accountId);
            return new ResponseEntity<>(Map.of("message", "Account deleted successfully."), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{accountId}")
    public ResponseEntity<?> updateAccountDetails(
            @PathVariable String accountId,
            @RequestBody AccountDto accountDto
    ) {
        try {
            Account account = userAccountsService.getAccountById(accountId);
            account.setAccountName(accountDto.getAccountName());
            account.setMonthlyIncome(accountDto.getMonthlyIncome());
            return new ResponseEntity<>(userAccountsService.updateAccountDetails(account), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
