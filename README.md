# Expense Tracker

## Project Overview

This is a full-stack expense tracker application that allows users to manage their financial transactions efficiently. Users can create multiple accounts, track transactions, and manage recurring expenses with ease.

## Features

- Users can create an account and add an initial amount for tracking expenses.
- A user can create up to **5 accounts**.
- Users can **transfer** amounts between accounts.
- Transactions can be recorded as **debit, credit, or transfer**.
- All transactions can be viewed **date-wise and month-wise**.
- Users can set up **recurring expenses** to avoid manually entering repeated expenses.

## Tech Stack

### Frontend

- **ReactJS** (for UI)
- **Chakra UI** (for styling)
- **Axios** (for API calls)
- **JWT** (for authentication & authorization)

### Backend

- **Spring Boot** (for REST APIs)
- **PostgreSQL** (for database management)

## Setup Instructions

### Prerequisites

- Node.js installed for frontend
- Java and Maven installed for backend
- PostgreSQL database setup

### Running the Frontend

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

### Running the Backend

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Configure the database connection in `application.properties`.
3. Build and run the backend:
   ```sh
   mvn spring-boot:run
   ```

## Future Enhancements

- Implement **budget tracking** features.
- Add **visual analytics and charts**.
- Support for **multiple currencies**.

## License

This project is open-source and available under the [MIT License](LICENSE).

