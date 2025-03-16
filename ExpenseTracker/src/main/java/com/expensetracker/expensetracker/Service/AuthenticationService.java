package com.expensetracker.expensetracker.Service;


import com.expensetracker.expensetracker.Dao.UserDao;
import com.expensetracker.expensetracker.Dtos.LoginResponse;
import com.expensetracker.expensetracker.Dtos.UserLoginDto;
import com.expensetracker.expensetracker.Dtos.UserSignUpDto;
import com.expensetracker.expensetracker.Repository.User;
import com.expensetracker.expensetracker.exceptions.CustomUserAlreadyExistsException;
import com.expensetracker.expensetracker.exceptions.CustomUserDoesNotExist;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class AuthenticationService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    public AuthenticationService(UserDao userDao, AuthenticationManager authenticationManager, JWTService jwtService) {
        this.userDao = userDao;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public int calculateAge(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate birthDate = LocalDate.parse(dateString.substring(0, 10), formatter);
        LocalDate today = LocalDate.now();
        return Period.between(birthDate, today).getYears();
    }

    public boolean userAlreadyExists(String username) {
        return userDao.findByUserEmail(username).isPresent();
    }

    public User signUpUser(UserSignUpDto newUser) {

        if (userAlreadyExists(newUser.getEmail())) {
            throw new CustomUserAlreadyExistsException("User with email " + newUser.getEmail() + " already exists. Try Signing in.");
        }
        User user = new User();
        user.setUserDisplayName(newUser.getUsername());
        user.setUserEmail(newUser.getEmail());
        user.setUserPassword(passwordEncoder.encode(newUser.getPassword()));
        user.setUserGender(newUser.getGender());
        user.setUserAge(calculateAge(newUser.getBirthDate()));
        user.setUserUpdatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")).toString());
        user.setUserCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")).toString());
        user.setUserBirthDate(LocalDate.parse("2024-11-07").atStartOfDay().toString());
        return userDao.save(user);
    }

    public LoginResponse loginUser(UserLoginDto user) {

        User loggedUser = userDao.findByUserEmail(user.getEmail()).orElseThrow(() -> new CustomUserDoesNotExist("User with email "+user.getEmail()+" does not exist. Try signing in."));

        System.out.println(loggedUser.getUserDisplayName());

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        System.out.println("Logged in as " + loggedUser.toString());
        String JwtToken = jwtService.generateToken(loggedUser);
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(JwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        System.out.println(1000);
        return loginResponse;

    }
}
