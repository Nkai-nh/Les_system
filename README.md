Backend Project LIFE ESSSENCE

1. Project Description

This backend project is designed to support the frontend application of an online store selling dietary supplements. It provides APIs for product management, user authentication, order processing, and other essential functionalities.
2. Requirements
 2.1 Necessary Software
  - Node.js (LTS version or higher).

  - npm or yarn for dependency management.

  - MySQL for the database system.

 2.2 Project Dependencies

  - Express.js: Web framework for building RESTful APIs.

  - Sequelize: ORM for interacting with MySQL.

  - jsonwebtoken: For user authentication.

  - bcrypt: For password hashing.
  
  - dotenv: For environment variable management.

3. Installation
  3.1 Clone the Project
   # Clone the repository locally
   $ git clone <repository-url>

  # Navigate to the project directory
  $ cd <project-directory>
 3.2 Install Dependencies
  # Install using npm
  $ npm install

  # Or install using yarn
  $ yarn install
5. Configure Environment Variables
  Create a .env file in the root directory and add the following configuration:
  PORT=4000
  DB_HOST=localhost
  DB_USER=<your-database-user>
  DB_PASSWORD=<your-database-password>
  DB_NAME=<your-database-name>
  JWT_SECRET=<your-secret-key>
Replace <your-database-user>, <your-database-password>, <your-database-name>, and <your-secret-key> with your MySQL credentials and secret key.
6. Database Setup
  6.1 Make sure your MySQL server is running.
  6.2 Run the following command to create the database:
    CREATE DATABASE <your-database-name>;
  6.3 Use Sequelize CLI or run migrations to set up the database schema:
    # Run Sequelize migrations
    $ npx sequelize-cli db:migrate
7. Running the Project
  7.1 Start the Server
    # Start the development server
    $ npm run dev
    # Or use yarn
    $ yarn dev
The server will run at http://localhost:4000 by default.
  7.2 Test API Endpoints
    Use tools like Postman or cURL to test API endpoints.
8. Directory Structure
  project/
  ├── src/               # Main source directory
  │   ├── controllers/   # API controllers
  │   ├── models/        # Database models
  │   ├── routes/        # API routes
  │   ├── middleware/    # Middleware functions
  │   └── server.js      # Server entry point
  ├── migrations/       # Database migrations
  ├── .env               # Environment configuration
  ├── package.json       # Project information and scripts
  └── README.md          # Documentation

9. Scripts
  - npm run dev : Run the development server.

  - npm start : Run the server in production mode.

  - npm run lint : Lint the codebase.

  - npx sequelize-cli db:migrate : Run database migrations.
10. Tools Used
  - Express.js: For building APIs.

  - MySQL: Database for storing application data.

  - Sequelize: ORM for database management.

  - Postman: For testing APIs.

  - dotenv: For environment variable management.

11. Contact
  For any questions or contributions, please contact us at [nguyenmanh002347@gmail.com/group 49].
12. Notes
    If you encounter issues, ensure all required software is installed and properly configured. For further support, feel free to reach out.
