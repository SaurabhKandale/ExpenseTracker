package com.expensetracker.expensetracker.Controllers;

import com.expensetracker.expensetracker.Repository.User;
import com.expensetracker.expensetracker.Service.UserService;
import com.expensetracker.expensetracker.exceptions.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserData() {
        try {
            User userDetails = userService.getUserDetails();
            return new ResponseEntity<>(userDetails, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }


}
