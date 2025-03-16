package com.expensetracker.expensetracker.Dao;

import com.expensetracker.expensetracker.Repository.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface AccountDao extends JpaRepository<Account, String> {

    @Modifying
    @Query("update Account a set a.accountStatus='inactive' where a.accountId=:accountId")
    void changeAccountStatus(String accountId);

    @Query("select a from Account a where a.accountName=:accountName")
    Optional<Account> existsAccountByAccountName(String accountName);

}
