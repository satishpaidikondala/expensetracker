package com.example.expensetracker.app.controller;

import com.example.expensetracker.app.model.Expense;
import com.example.expensetracker.app.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense) {
        return new ResponseEntity<>(service.createExpense(expense), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        return service.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expense) {
        try {
            return ResponseEntity.ok(service.updateExpense(id, expense));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(
            @RequestParam(required = false) LocalDate start_date,
            @RequestParam(required = false) LocalDate end_date,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal min_amount,
            @RequestParam(required = false) BigDecimal max_amount,
            @RequestParam(defaultValue = "date") String sort_by,
            @RequestParam(defaultValue = "asc") String order) {
        
        return ResponseEntity.ok(service.getExpenses(start_date, end_date, category, min_amount, max_amount, sort_by, order));
    }

    @GetMapping("/summary/by-category")
    public ResponseEntity<Map<String, BigDecimal>> getCategorySummary() {
        return ResponseEntity.ok(service.getCategorySummary());
    }

    @GetMapping("/summary/monthly")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlySummary() {
        return ResponseEntity.ok(service.getMonthlySummary());
    }
}