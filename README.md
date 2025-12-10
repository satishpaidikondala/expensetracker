# Expense Tracker API

A robust RESTful API built with Java Spring Boot to manage personal expenses. It supports advanced filtering, sorting, and data aggregation (summaries by category and month).

## Features
- **CRUD Operations**: Create, Read, Update, Delete expenses.
- **Dynamic Filtering**: Filter by date range, category, and amount range.
- **Sorting**: Sort by date or amount (ascending/descending).
- **Aggregations**: Get insights like "Total spent on Food" or "Monthly spending breakdown".
- **Validation**: Ensures data integrity (no negative amounts, valid dates).

## Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3
- **Database**: H2 (In-Memory) / Compatible with MySQL/PostgreSQL
- **Build Tool**: Maven

---

## Setup & Running Locally

### Prerequisites
- Java JDK 21+ installed.
- Maven installed (or use the `mvnw` wrapper).

### Steps
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/satishpaidikondala/expensetracker.git]
   cd expensetracker
