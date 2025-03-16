package com.expensetracker.expensetracker.Dao;

import com.expensetracker.expensetracker.Repository.RecurringExpense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecurringExpenseDao extends JpaRepository<RecurringExpense, String> {


}
