package com.expensetracker.expensetracker.Dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

public class UserSignUpDto {
    private String username;
    private String password;
    private String email;
    private String birthDate;
    private String gender;


}
