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

- Rename the `.env.example` file to `.env` and update the values as needed.

  > [!NOTE]
  >
  > - All of the development environment variables are already pre-configured to connect to development instances of a Postgres DB and Redis store. You can update these values to connect to your own instances, or use them as is. Just ensure that the connection details are correct and match the instances you spin up.
  > - For Clerk and UploadThing, you will need to create accounts with those services and extract the needed keys and secrets to set up the environment variables. \_Right now they are logged down as <your_value>
  >   <br /> **Submit an issue if you need help setting up the environment variables.**

5. **Setup the database for local development**

> [!NOTE]
>
> Make sure you have the following completed:
>
> - environment variables set up
> - database connection details are correct
> - database is running (locally or cloud-hosted - just make sure the connection details are correct)
> - make utility is installed (if not, you can install it using `npm install -g make-cli`)

```bash
make setup-db
```

This will generate a migration script in the `migrations` folder, run the migration against the database, and seed the database with some initial data.

6. **Set up local tunnel for webhooks (optional)**
   If you want to test the webhooks locally, you can use ngrok to create a secure tunnel to your local server.

   > Ensure you have ngrok installed on your machine. If not, you can download it from the [official website](https://ngrok.com/download).

   ```bash
   make tunnel
   ```

   > Copy the forwarding URL generated by ngrok and add it to the webhook settings in Clerk.

7. **Start the server:**
   ```bash
   pnpm dev
   ```

**Docker support is coming soon!**

## API Endpoints

You can head to the [api documentation](http://localhost:8010/docs) to understand all the APIs and how to consume them.

> Run the server and navigate to `http://localhost:8010/docs` to view the API documentation. (Make sure the server is running before you access the documentation.)
>
> You can also import the [Postman collection](postman-collection.json) into Postman to test the API endpoints and explore the available features.
>
> WIP: Deployment of API documentation to a public URL.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
