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

> [!NOTE]
> The API adheres to the OpenAPI Specification, automatically generating documentation that is rendered using Scalar for an interactive, user-friendly experience.
> Go to `http://localhost:8010/docs` and you will be able to understand all the APIs
> and how to consume them.

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
   >
   > - You can use a local database or a cloud-hosted database like Supabase.
   > - If you're using Supabase, you can find your database connection details in the "Settings" tab of your Supabase project.
   > - **Docker support is coming soon so this can be automated**

5. **Start the server:**
   ```bash
   pnpm dev
   ```
6. **Test the API:**
   Import the [Postman collection](postman-collection.json) into Postman to test the API endpoints and explore the available features.

> Docker support is coming soon!

## API Endpoints

You can head to the [api documentation](http://localhost:8010/docs) to understand all the APIs and how to consume them.

> Run the server and navigate to `http://localhost:8010/docs` to view the API documentation. (Make sure the server is running before you access the documentation.)
>
> You can also import the [Postman collection](postman-collection.json) into Postman to test the API endpoints and explore the available features.
>
> WIP: Deployment of API documentation to a public URL.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
