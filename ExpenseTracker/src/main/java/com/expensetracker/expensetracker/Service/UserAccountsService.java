package com.expensetracker.expensetracker.Service;


import com.expensetracker.expensetracker.Dao.AccountDao;
import com.expensetracker.expensetracker.Dao.UserDao;
import com.expensetracker.expensetracker.Dtos.AccountDto;
import com.expensetracker.expensetracker.Repository.Account;
import com.expensetracker.expensetracker.exceptions.AccountAlreadyExists;
import com.expensetracker.expensetracker.exceptions.AccountDoesNotExist;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserAccountsService {


    private final AccountDao accountDao;

    public UserAccountsService(AccountDao accountDao, UserDao userDao) {
        this.accountDao = accountDao;
    }

    public Account addUserAccount(AccountDto accountDto) {

        if (accountDao.existsAccountByAccountName(accountDto.getAccountName()).isPresent()) {
            System.out.println("Gotcha account");
            throw new AccountAlreadyExists("Account with name " + accountDto.getAccountName() + " already exists.");
        }
        Account account = new Account(accountDto);
        return accountDao.save(account);
    }

    @Transactional
    public void changeAccountStatusToInactive(String accountId) {
        accountDao.changeAccountStatus(accountId);

    }

    public Account updateAccountDetails(Account account) {
        Account oldAccount = getAccountById(account.getAccountId());
        account.setAccountTransactions(oldAccount.getAccountTransactions());
        return accountDao.save(account);
    }

    public Account getAccountById(String accountId) {
        return accountDao.findById(accountId).orElseThrow(() -> new AccountDoesNotExist("Account with id " + accountId + " does not exist."));
    }
}
