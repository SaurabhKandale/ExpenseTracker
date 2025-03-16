package com.expensetracker.expensetracker.Service;

import com.expensetracker.expensetracker.Repository.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public User getUserDetails() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

}
