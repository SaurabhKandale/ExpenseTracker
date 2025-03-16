package com.expensetracker.expensetracker.Dao;

import com.expensetracker.expensetracker.Repository.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDao extends JpaRepository<User, Long> {

    
    Optional<User> findByUserEmail(String email);

}
