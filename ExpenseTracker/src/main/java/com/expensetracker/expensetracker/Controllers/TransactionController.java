package com.expensetracker.expensetracker.Controllers;


import com.expensetracker.expensetracker.Dtos.TransactionDto;
import com.expensetracker.expensetracker.Repository.Transaction;
import com.expensetracker.expensetracker.Service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addNewTransaction(@RequestBody TransactionDto transactionDto) {
        return new ResponseEntity<>(transactionService.addNewTransaction(transactionDto), HttpStatus.CREATED);
    }


    @GetMapping("/get/{monthAndYear}/{userId}")
    public ResponseEntity<?> getTransactionsByUserId(@PathVariable String userId, @PathVariable String monthAndYear) {
        return new ResponseEntity<>(transactionService.getMonthwiseTransactionsByUserId(userId, monthAndYear), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTransaction(@RequestBody Transaction transactionDetails) {
        return new ResponseEntity<>(transactionService.updateTransaction(transactionDetails), HttpStatus.OK);
    }

    @DeleteMapping("/remove/{transactionId}")
    public ResponseEntity<?> removeTransactionById(@PathVariable String transactionId) {
        return new ResponseEntity<>(transactionService.removeTransaction(transactionId), HttpStatus.OK);
    }
}
