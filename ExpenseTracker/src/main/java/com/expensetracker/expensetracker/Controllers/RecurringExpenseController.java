package com.expensetracker.expensetracker.Controllers;

import com.expensetracker.expensetracker.Dtos.DeleteResponse;
import com.expensetracker.expensetracker.Dtos.RecurringExpenseDto;
import com.expensetracker.expensetracker.Repository.RecurringExpense;
import com.expensetracker.expensetracker.Service.RecurringExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recurringExpense")
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;
    public RecurringExpenseController(RecurringExpenseService recurringExpenseService) {
        this.recurringExpenseService = recurringExpenseService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addRecurringExpense(@RequestBody RecurringExpenseDto recurringExpenseDto){
        return new ResponseEntity<>( recurringExpenseService.addRecurringExpense(recurringExpenseDto) , HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateRecurringExpense(@RequestBody RecurringExpense recurringExpense){
        return new ResponseEntity<>( recurringExpenseService.updateRecurringExpense(recurringExpense), HttpStatus.OK);
    }

    @DeleteMapping("/remove/{recurringExpenseId}")
    public ResponseEntity<?> removeRecurringExpense(@PathVariable String recurringfrequentExpenseId){
        recurringExpenseService.removeRecurringExpenseById(recurringfrequentExpenseId);
        return new ResponseEntity<>(new DeleteResponse("Recurring response deleted successfully"), HttpStatus.OK);
    }

}
