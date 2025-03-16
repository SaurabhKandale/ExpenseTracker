package com.expensetracker.expensetracker.Controllers;


import com.expensetracker.expensetracker.Dtos.LoginResponse;
import com.expensetracker.expensetracker.Dtos.UserLoginDto;
import com.expensetracker.expensetracker.Dtos.UserSignUpDto;
import com.expensetracker.expensetracker.Repository.User;
import com.expensetracker.expensetracker.Service.AuthenticationService;
import com.expensetracker.expensetracker.exceptions.CustomUserAlreadyExistsException;
import com.expensetracker.expensetracker.exceptions.CustomUserDoesNotExist;
import com.expensetracker.expensetracker.exceptions.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserSignUpDto user) {
        try {
            User registeredUser = authenticationService.signUpUser(user);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (CustomUserAlreadyExistsException e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.CONFLICT.value(), e.getMessage()), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDto user) {
        try {
            LoginResponse loginResponse = authenticationService.loginUser(user);
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        } catch (CustomUserDoesNotExist e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.NOT_FOUND.value(), e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Entered  password is incorrect."), HttpStatus.UNAUTHORIZED);
        }
    }

}

