package com.example.expensetracker.app.spec;

import com.example.expensetracker.app.model.Expense;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ExpenseSpecification {

    public static Specification<Expense> filterExpenses(LocalDate startDate, LocalDate endDate, 
                                                        String category, BigDecimal minAmount, BigDecimal maxAmount) {
        return (root, query, criteriaBuilder) -> {
            // 1. Create a list to hold all our filtering conditions
            List<Predicate> predicates = new ArrayList<>();

            // 2. Add conditions dynamically if the parameters are present
            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate));
            }
            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate));
            }
            if (category != null && !category.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }
            if (minAmount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("amount"), minAmount));
            }
            if (maxAmount != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("amount"), maxAmount));
            }

            // 3. Combine all predicates with AND logic (WHERE x AND y AND z)
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}