package com.example.expensetracker.app.service;

import com.example.expensetracker.app.model.Expense;
import com.example.expensetracker.app.repository.ExpenseRepository;
import com.example.expensetracker.app.spec.ExpenseSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public Expense createExpense(Expense expense) {
        return repository.save(expense);
    }

    public Optional<Expense> getExpenseById(Long id) {
        return repository.findById(id);
    }

    public Expense updateExpense(Long id, Expense expenseDetails) {
        return repository.findById(id).map(expense -> {
            expense.setAmount(expenseDetails.getAmount());
            expense.setCategory(expenseDetails.getCategory());
            expense.setDescription(expenseDetails.getDescription());
            expense.setDate(expenseDetails.getDate());
            return repository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public void deleteExpense(Long id) {
        repository.deleteById(id);
    }

    public List<Expense> getExpenses(LocalDate start, LocalDate end, String category, 
                                     BigDecimal min, BigDecimal max, String sortBy, String order) {
        
        Specification<Expense> spec = ExpenseSpecification.filterExpenses(start, end, category, min, max);
        
        Sort sort = Sort.by(sortBy != null ? sortBy : "date");
        if ("desc".equalsIgnoreCase(order)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        return repository.findAll(spec, sort);
    }

    public Map<String, BigDecimal> getCategorySummary() {
        List<Object[]> results = repository.sumAmountByCategory();
        Map<String, BigDecimal> summary = new HashMap<>();
        for (Object[] result : results) {
            summary.put((String) result[0], (BigDecimal) result[1]);
        }
        return summary;
    }

    public Map<String, BigDecimal> getMonthlySummary() {
        int currentYear = LocalDate.now().getYear();
        List<Object[]> results = repository.sumAmountByMonth(currentYear);
        
        Map<String, BigDecimal> summary = new LinkedHashMap<>();
        
        for (Object[] result : results) {
            Integer monthIndex = (Integer) result[0];
            BigDecimal total = (BigDecimal) result[1];
            String monthName = Month.of(monthIndex).name();
            summary.put(monthName, total);
        }
        return summary;
    }
}