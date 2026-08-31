package com.example.expensetracker.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity

@Table(name = "expenses", indexes = {
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_date", columnList = "date"),
    @Index(name = "idx_user_id", columnList = "user_id")
})
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId = "default";

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;

    @NotNull(message = "Date is required")
    private LocalDate date;
    
	public Expense() {
		
		// TODO Auto-generated constructor stub
	}

	public Expense(Long id,
			@NotNull(message = "Amount is required") @Positive(message = "Amount must be positive") BigDecimal amount,
			@NotBlank(message = "Category is required") String category, String description,
			@NotNull(message = "Date is required") LocalDate date) {
		
		this.id = id;
		this.amount = amount;
		this.category = category;
		this.description = description;
		this.date = date;
		this.userId = "default";
	}

	public String getUserId() { return userId; }
	public void setUserId(String userId) { this.userId = userId; }


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}


    
    
}
