package com.example.expensetracker.app.repository;

import com.example.expensetracker.app.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

    // Group by Category
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e GROUP BY e.category")
    List<Object[]> sumAmountByCategory();

    // Group by Month (Standard JPQL - Works on all DBs)
    @Query("SELECT EXTRACT(MONTH FROM e.date), SUM(e.amount) FROM Expense e WHERE EXTRACT(YEAR FROM e.date) = :year GROUP BY EXTRACT(MONTH FROM e.date)")
    List<Object[]> sumAmountByMonth(@Param("year") int year);
}