# Spendaro API

Welcome to the Spendaro API! This is the backend service for the Spendaro finance application, which helps users budget using the "Give Every Dollar a Job" methodology.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Introduction

The Spendaro API is a RESTful service designed to manage financial data for the Spendaro application. It allows users to create budgets, track expenses, and allocate funds to specific categories.

## Features

- User authentication and authorization
- Budget creation and management
- Expense tracking
- Category management
- Reporting and analytics

>[!NOTE]
> Our API adheres to the OpenAPI Specification, automatically generating documentation that is rendered using Scalar for an interactive, user-friendly experience.​​​​​​​​​​​​​​​​

## Getting Started

To get started with the Spendaro API, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/tannerbarcelos/spendaro-api.git
    ```
2. **Navigate to the project directory:**
    ```bash
    cd spendaro-api
    ```
3. **Install dependencies:**
    ```bash
    pnpm install
    ```

4. **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following environment variables:

    ```env
      NODE_ENV=
      DB_HOST=
      DB_USER=
      DB_PASSWORD=
      DB_NAME=
      JWT_SECRET= <generate using `openssl rand -base64 32`>
    ```
    > Note: Replace the values with your own database connection details. 
    > * You can use a local database or a cloud-hosted database like Supabase.
    > * If you're using Supabase, you can find your database connection details in the "Settings" tab of your Supabase project.
    > * **Docker support is coming soon so this can be automated**

5. **Start the server:**
    ```bash
    pnpm dev
    ```
6. **Test the API:**
    Import the [Postman collection](Spendaro.postman_collection.json) into Postman to test the API endpoints and explore the available features.

> Docker support is coming soon!

## API Endpoints

Here are some of the key endpoints available in the Spendaro API:

- **User Authentication:**
  - `POST /api/v1/auth/signup` - Signup a new user
  - `POST /api/v1/auth/signin` - Signin an existing user

- **Budgets:**
  - `GET /api/v1/budgets/` - Get all budgets
  - `POST /api/v1/budgets/` - Create a new budget
  - `GET /api/v1/budgets/:id` - Get a specific budget
  - `PUT /api/v1/budgets/:id` - Update a budget
  - `DELETE /api/v1/budgets/:id` - Delete a budget

- **Expenses: (coming soon)**
  - `GET /api/v1/expenses` - Get all expenses
  - `POST /api/v1/expenses` - Create a new expense
  - `GET /api/v1/expenses/:id` - Get a specific expense
  - `PUT /api/v1/expenses/:id` - Update an expense
  - `DELETE /api/v1/expenses/:id` - Delete an expense

- **Categories:**
  - `GET /api/v1/budgets/categories` - Get all categories
  - `POST /api/v1/budgets/categories` - Create a new category
  - `GET /api/v1/budgets/categories/:id` - Get a specific category
  - `PUT /api/v1/budgets/categories/:id` - Update a category
  - `DELETE /api/v1/budgets/categories/:id` - Delete a category

- **Category Items:**
  - `GET /api/v1/budgets/categories/:id/items` - Get all items for a category
  - `POST /api/v1/budgets/categories/:id/items` - Create a new item for a category
  - `GET /api/v1/budgets/categories/:id/items/:itemId` - Get a specific item for a category
  - `PUT /api/v1/budgets/categories/:id/items/:itemId` - Update an item for a category
  - `DELETE /api/v1/budgets/categories/:id/items/:itemId` - Delete an item for a category

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.