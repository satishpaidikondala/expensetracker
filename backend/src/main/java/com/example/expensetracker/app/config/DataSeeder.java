package com.example.expensetracker.app.config;

import com.example.expensetracker.app.model.Expense;
import com.example.expensetracker.app.repository.ExpenseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ExpenseRepository repository;

    public DataSeeder(ExpenseRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        List<Expense> seed = List.of(
            new Expense(null, new BigDecimal("50.00"), "Food", "Sandwich", LocalDate.of(2025, 1, 5)),
            new Expense(null, new BigDecimal("1200.00"), "Bills", "Rent", LocalDate.of(2025, 1, 1)),
            new Expense(null, new BigDecimal("45.00"), "Transport", "Uber", LocalDate.of(2025, 1, 10)),
            new Expense(null, new BigDecimal("150.00"), "Food", "Valentine Dinner", LocalDate.of(2025, 2, 14)),
            new Expense(null, new BigDecimal("80.00"), "Bills", "Electricity", LocalDate.of(2025, 2, 20)),
            new Expense(null, new BigDecimal("300.00"), "Shopping", "New Shoes", LocalDate.of(2025, 3, 10)),
            new Expense(null, new BigDecimal("60.00"), "Food", "Groceries", LocalDate.of(2025, 3, 15)),
            new Expense(null, new BigDecimal("15.00"), "Entertainment", "Movie Ticket", LocalDate.of(2025, 4, 5)),
            new Expense(null, new BigDecimal("90.00"), "Transport", "Monthly Pass", LocalDate.of(2025, 4, 1)),
            new Expense(null, new BigDecimal("500.00"), "Bills", "Car Insurance", LocalDate.of(2025, 5, 20)),
            new Expense(null, new BigDecimal("120.00"), "Food", "Fancy Dinner", LocalDate.of(2025, 5, 25)),
            new Expense(null, new BigDecimal("45.50"), "Other", "Gift for friend", LocalDate.of(2025, 6, 10)),
            new Expense(null, new BigDecimal("200.00"), "Food", "Supermarket", LocalDate.of(2025, 6, 15)),
            new Expense(null, new BigDecimal("1000.00"), "Travel", "Flight Tickets", LocalDate.of(2025, 7, 1)),
            new Expense(null, new BigDecimal("55.00"), "Transport", "Taxi", LocalDate.of(2025, 7, 5)),
            new Expense(null, new BigDecimal("199.00"), "Entertainment", "Netflix Year Sub", LocalDate.of(2025, 8, 15)),
            new Expense(null, new BigDecimal("30.00"), "Food", "Pizza", LocalDate.of(2025, 8, 20)),
            new Expense(null, new BigDecimal("250.00"), "Shopping", "Clothes", LocalDate.of(2025, 9, 10)),
            new Expense(null, new BigDecimal("40.00"), "Transport", "Bus", LocalDate.of(2025, 9, 12)),
            new Expense(null, new BigDecimal("600.00"), "Bills", "Heating Bill", LocalDate.of(2025, 10, 1)),
            new Expense(null, new BigDecimal("75.00"), "Food", "Lunch with Client", LocalDate.of(2025, 10, 15)),
            new Expense(null, new BigDecimal("150.00"), "Shopping", "Black Friday", LocalDate.of(2025, 11, 25)),
            new Expense(null, new BigDecimal("20.00"), "Other", "Coffee", LocalDate.of(2025, 11, 30)),
            new Expense(null, new BigDecimal("300.00"), "Food", "Christmas Dinner", LocalDate.of(2025, 12, 25)),
            new Expense(null, new BigDecimal("100.00"), "Other", "Charity", LocalDate.of(2025, 12, 28))
        );

        repository.saveAll(seed);

        int y = LocalDate.now().getYear();
        if (y != 2025) {
            List<Expense> current = List.of(
                new Expense(null, new BigDecimal("85.00"), "Food", "Groceries", LocalDate.of(y, 1, 12)),
                new Expense(null, new BigDecimal("1100.00"), "Bills", "Rent", LocalDate.of(y, 1, 1)),
                new Expense(null, new BigDecimal("45.00"), "Transport", "Bus Pass", LocalDate.of(y, 2, 1)),
                new Expense(null, new BigDecimal("200.00"), "Shopping", "New Jacket", LocalDate.of(y, 2, 15)),
                new Expense(null, new BigDecimal("60.00"), "Food", "Lunch Out", LocalDate.of(y, 3, 8)),
                new Expense(null, new BigDecimal("500.00"), "Bills", "Insurance", LocalDate.of(y, 3, 20)),
                new Expense(null, new BigDecimal("35.00"), "Entertainment", "Streaming", LocalDate.of(y, 4, 5)),
                new Expense(null, new BigDecimal("150.00"), "Food", "Dinner", LocalDate.of(y, 4, 18)),
                new Expense(null, new BigDecimal("320.00"), "Bills", "Electricity", LocalDate.of(y, 5, 10)),
                new Expense(null, new BigDecimal("75.00"), "Transport", "Gas", LocalDate.of(y, 5, 22)),
                new Expense(null, new BigDecimal("99.00"), "Other", "Gift", LocalDate.of(y, 6, 14)),
                new Expense(null, new BigDecimal("180.00"), "Food", "BBQ Supplies", LocalDate.of(y, 6, 28)),
                new Expense(null, new BigDecimal("40.00"), "Entertainment", "Movie", LocalDate.of(y, 7, 3)),
                new Expense(null, new BigDecimal("850.00"), "Travel", "Weekend Trip", LocalDate.of(y, 7, 19))
            );
            repository.saveAll(current);
        }
    }
}
