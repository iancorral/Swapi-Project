# Swapi Project

Student exchange platform developed for the La Salle Chihuahua community.

## Repository Structure

The project is organized into two main directories:
- backend/: RESTful API built with Node.js, Express, TypeScript, and MongoDB.
- frontend/: Web application built with React and Vite.

---

## Installation and Execution Instructions (Backend)

Follow these steps to configure and run the backend server in a local environment.

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or connection string to MongoDB Atlas)

### 2. Dependency Installation
Navigate to the backend directory and install the necessary packages via the terminal:

cd backend
npm install

### 3. Environment Variables Configuration
The project requires sensitive environment variables to connect to the database and external services.

1. Locate the .env.example file in the backend/ folder.
2. Create a copy of this file and rename it to .env.
3. Enter your own credentials in the .env file (MongoDB URI, email credentials, Cloudinary, etc.).

Note: The actual .env file is not included in the repository for security reasons.

### 4. Database Seeding (Seed Data)
To facilitate evaluation and testing, a script has been included to clean the database and automatically generate test users and posts.

Execute the following command inside the backend/ folder:

npm run seed

This command will perform the following actions:
- Clear existing data in the connected database.
- Create an admin user: admin@ulsachihuahua.edu.mx (Password: 123456)
- Create a student user: estudiante@ulsachihuahua.edu.mx (Password: 123456)
- Generate sample posts (sales, rentals, services).

### 5. Running the Server
To start the server in development mode:

npm run dev

The server will start by default at: http://localhost:3000

---

## Installation Instructions (Frontend)

If you wish to run the web interface locally:

1. Navigate to the frontend directory:
cd frontend

2. Install dependencies:
npm install

3. Run the development server:
npm run dev

---

## Authors
- Ian Corral
- Omar Acuña
