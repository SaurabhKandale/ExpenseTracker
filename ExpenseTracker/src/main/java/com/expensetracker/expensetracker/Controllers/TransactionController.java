package com.expensetracker.expensetracker.Controllers;


import com.expensetracker.expensetracker.Dtos.TransactionDto;
import com.expensetracker.expensetracker.Repository.Transaction;
import com.expensetracker.expensetracker.Repository.User;
import com.expensetracker.expensetracker.Service.TransactionService;
import com.expensetracker.expensetracker.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;

    public TransactionController(TransactionService transactionService, UserService userService) {
        this.transactionService = transactionService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> addNewTransaction(@RequestBody TransactionDto transactionDto) {
        User user = userService.getUserDetails();
        if (transactionDto.getUserId() == null || transactionDto.getUserId().isBlank()) {
            transactionDto.setUserId(user.getUserId());
        }
        return new ResponseEntity<>(transactionService.addNewTransaction(transactionDto), HttpStatus.CREATED);
    }

    @GetMapping("/get/{date}")
    public ResponseEntity<?> getTransactionsByDate(@PathVariable String date) {
        User user = userService.getUserDetails();
        return new ResponseEntity<>(
                transactionService.getMonthwiseTransactionsByUserId(user.getUserId(), date),
                HttpStatus.OK
        );
    }

    @PutMapping("/update/{transactionId}")
    public ResponseEntity<?> updateTransaction(
            @PathVariable String transactionId,
            @RequestBody Transaction transactionDetails
    ) {
        transactionDetails.setTransactionId(transactionId);
        return new ResponseEntity<>(transactionService.updateTransaction(transactionDetails), HttpStatus.OK);
    }

    @DeleteMapping("/remove/{transactionId}")
    public ResponseEntity<?> removeTransactionById(@PathVariable String transactionId) {
        return new ResponseEntity<>(transactionService.removeTransaction(transactionId), HttpStatus.OK);
    }
}
