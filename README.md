# Slack Mock

Slack Mock is a simplified clone of Slack, demonstrating a full-stack application with a React frontend, Express backend, and PostgreSQL database.

## Features

- User authentication
- Workspace selection
- Channel viewing and messaging
- Real-time chat functionality

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)
- Docker (optional, for containerized database)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/slack-mock.git
   cd slack-mock
   ```

2. Install dependencies for the root project, backend, frontend, and e2e testing:
   ```
   npm run postinstall
   ```

3. Set up the environment variables:
   Create a `.env` file in the `backend` directory with the following content:
   ```
   POSTGRES_DB=your_database_name
   POSTGRES_USER=your_database_user
   POSTGRES_PASSWORD=your_database_password
   SECRET=your_jwt_secret
   ```

4. Set up the database:
   If using Docker, run:
   ```
   cd backend
   docker-compose up -d
   ```
   Otherwise, create a PostgreSQL database and user matching your `.env` file.

## Running the Application

1. Start the backend server:
   ```
   npm run start-backend
   ```

2. In a new terminal, start the frontend development server:
   ```
   npm run start-frontend
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Running Tests

- To run backend tests:
  ```
  cd backend
  npm test
  ```

- To run frontend tests:
  ```
  cd frontend
  npm test
  ```

- To run end-to-end tests:
  ```
  cd e2e
  npm test
  ```

## Project Structure

- `backend/`: Express.js server and API
- `frontend/`: React application
- `e2e/`: End-to-end tests using Puppeteer

## API Documentation

API documentation is available at `http://localhost:3010/v0/api-docs/` when the backend server is running.


This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
