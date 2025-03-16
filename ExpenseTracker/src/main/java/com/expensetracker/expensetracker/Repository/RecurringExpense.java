package com.expensetracker.expensetracker.Repository;

import com.expensetracker.expensetracker.Dtos.RecurringExpenseDto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecurringExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private String recurringExpenseId;

    @Column(nullable = false)
    private String recurringExpenseTitle;

    @Column(nullable = false)
    private String recurringExpenseCategory;
    @Column(nullable = false)
    private String recurringExpenseAccountId;
    @Column(nullable = false)
    private double recurringExpenseAmount;
    @JoinColumn(name = "user_id", nullable = false)
    private String userId;


    public RecurringExpense(RecurringExpenseDto frequentExpenseDto) {
        this.recurringExpenseTitle = frequentExpenseDto.getRecurringExpenseTitle();
        this.recurringExpenseCategory = frequentExpenseDto.getRecurringExpenseCategory();
        this.recurringExpenseAccountId = frequentExpenseDto.getRecurringExpenseAccountId();
        this.recurringExpenseAmount=frequentExpenseDto.getRecurringExpenseAmount();
        this.userId=frequentExpenseDto.getRecurringExpenseUserId();
    }

}
