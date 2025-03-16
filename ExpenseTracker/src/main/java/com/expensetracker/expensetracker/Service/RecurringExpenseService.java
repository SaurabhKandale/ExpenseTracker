package com.expensetracker.expensetracker.Service;


import com.expensetracker.expensetracker.Dao.RecurringExpenseDao;
import com.expensetracker.expensetracker.Dtos.RecurringExpenseDto;
import com.expensetracker.expensetracker.Repository.RecurringExpense;
import org.springframework.stereotype.Service;

@Service
public class RecurringExpenseService {

    private final RecurringExpenseDao recurringExpenseDao;

    public RecurringExpenseService(RecurringExpenseDao recurringExpenseDao) {
        this.recurringExpenseDao = recurringExpenseDao;
    }

    public RecurringExpense addRecurringExpense(RecurringExpenseDto recurringExpenseDto) {
        RecurringExpense recurringExpense = new RecurringExpense(recurringExpenseDto);
        return recurringExpenseDao.save(recurringExpense);
    }

    public void removeRecurringExpenseById(String recurringExpenseId) {
        recurringExpenseDao.deleteById(recurringExpenseId);
    }

    public RecurringExpense updateRecurringExpense(RecurringExpense recurringExpense) {
        return recurringExpenseDao.save(recurringExpense);
    }
}
