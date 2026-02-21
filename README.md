
# Task-Scheduler API

 Task Scheduler API built with NestJS, designed to handle user authentication, task management, and background job processing efficiently using Bullmq.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/bullmq-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/swagger-%2385EA2D.svg?style=for-the-badge&logo=swagger&logoColor=black)

## API Documentation

This project uses Swagger for API documentation. Once the application is running, you can access the Swagger UI at [http://localhost:5000/api](http://localhost:5000/api).

## Features

- **User Authentication:** Secure user registration and login with JWT-based authentication.
- **Password Management:** Securely change passwords with hashing.
- **Role-Based Access Control (RBAC):** Differentiated access levels for users and administrators.
- **Task Management:** Create, retrieve, update, and delete tasks.
- **Task Prioritization and Status:** Assign priority and status to tasks.
- **Background Job Processing:** Excutes tasks automatically on excution time (execution time provided upon task creation)
- **Refresh Token Rotation:** Securely refresh access tokens using httpOnly cookies.

## Technologies

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Background Jobs:** [BullMQ](https://bullmq.io/)
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Validation:** [class-validator](https://github.com/typestack/class-validator), [class-transformer](https://github.com/typestack/class-transformer) and [Joi](https://joi.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Authentication Flow

1.  **User Registration:** New users can register by providing their details.
2.  **User Login:** Upon successful login, the API returns an `access_token` and a `refresh_token`.
    -   The `access_token` is sent in the response body to be stored in memory.
    -   The `refresh_token` is sent as an `httpOnly` cookie, which is automatically handled by the browser and is not accessible to JavaScript.
3.  **Authenticated Requests:** The `access_token` must be included in the `Authorization` header for all protected endpoints.
4.  **Token Refresh:** When the `access_token` expires, the client can request a new one by calling the `/auth/refresh` endpoint. The `refresh_token` (stored in the httpOnly cookie) is automatically sent with the request. This endpoint returns a new `access_token`.
5.  **Logout:** When a user logs out, the `refresh_token` is cleared from the database.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/topics/quickstart)

### Installation

1.  Clone the repository:
    ```
    git clone https://github.com/Ahmed-Ossamaa/Task-Scheduler.git
    ```
2.  Navigate to the project directory:
    ```
    cd task-manager
    ```
3.  Install the dependencies:
    ```
    npm install
    ```
4.  Set up the environment variables by creating a `.env` file in the root directory. See the `.env.example` section for the required variables.

### Running the Application

-   **Development:**
    ```
    npm run start:dev
    ```
-   **Production:**
    ```
    npm run start:prod
    ```

## API Endpoints

### Authentication

-   `POST /auth/register`: Register a new user.
-   `POST /auth/login`: Log in a user.
-   `POST /auth/refresh`: Refresh the access token.
-   `POST /auth/logout`: Log out a user.
-   `POST /auth/change-password`: Change the user's password.

### Users

-   `GET /users`: Get all users (Admin only).
-   `GET /users/me`: Get the current user's profile.
-   `PATCH /users/me`: Update the current user's profile.
-   `DELETE /users/:id`: Delete a user (Admin only).

### Tasks

-   `POST /tasks`: Create a new task.
-   `GET /tasks`: Get all tasks for the current user.
-   `GET /tasks/:id`: Get a specific task.
-   `PATCH /tasks/:id`: Update a task.
-   `DELETE /tasks/:id`: Delete a task.

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
# Application
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your-db-username
DB_PASS=your-db-password
DB_NAME=your-db-name
DB_AUTO_LOAD_ENTITIES=true
......OR....
DATABASE_URL=your-db-url

# JWT
JWT_ACCESS_SECRET=your-JWT_ACCESS_SECRET
JWT_REFRESH_SECRET=your-JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password

REDIS_ATTEMPTS=3
REDIS_BACKOFF_TYPE=exponential
REDIS_BACKOFF_DELAY=3000
REDIS_REMOVE_ON_COMPLETE=true
REDIS_REMOVE_ON_FAIL=false
```

