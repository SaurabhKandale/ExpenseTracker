package com.expensetracker.expensetracker.Controllers;

import com.expensetracker.expensetracker.Dtos.DeleteResponse;
import com.expensetracker.expensetracker.Dtos.RecurringExpenseDto;
import com.expensetracker.expensetracker.Repository.RecurringExpense;
import com.expensetracker.expensetracker.Repository.User;
import com.expensetracker.expensetracker.Service.RecurringExpenseService;
import com.expensetracker.expensetracker.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recurringExpense")
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;
    private final UserService userService;

    public RecurringExpenseController(
            RecurringExpenseService recurringExpenseService,
            UserService userService
    ) {
        this.recurringExpenseService = recurringExpenseService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> addRecurringExpense(@RequestBody RecurringExpenseDto recurringExpenseDto) {
        User user = userService.getUserDetails();
        if (recurringExpenseDto.getRecurringExpenseUserId() == null
                || recurringExpenseDto.getRecurringExpenseUserId().isBlank()) {
            recurringExpenseDto.setRecurringExpenseUserId(user.getUserId());
        }
        return new ResponseEntity<>(recurringExpenseService.addRecurringExpense(recurringExpenseDto), HttpStatus.CREATED);
    }

    @PutMapping("/update/{recurringExpenseId}")
    public ResponseEntity<?> updateRecurringExpense(
            @PathVariable String recurringExpenseId,
            @RequestBody RecurringExpense recurringExpense
    ) {
        recurringExpense.setRecurringExpenseId(recurringExpenseId);
        return new ResponseEntity<>(recurringExpenseService.updateRecurringExpense(recurringExpense), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{recurringExpenseId}")
    public ResponseEntity<?> removeRecurringExpense(@PathVariable String recurringExpenseId) {
        recurringExpenseService.removeRecurringExpenseById(recurringExpenseId);
        return new ResponseEntity<>(new DeleteResponse("Recurring expense deleted"), HttpStatus.OK);
    }

}
