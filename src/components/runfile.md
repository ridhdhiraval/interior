# How to Run the Iconic Interior Project

Follow these step-by-step instructions to set up and run the full-stack project (Frontend + Backend + PostgreSQL Database) on your local machine.

## 1. Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js**: (v18 or higher recommended)
- **PostgreSQL**: (Running locally on port 5432)
- **pgAdmin** (Optional but recommended for viewing the database comfortably)

## 2. Database Setup
The backend relies on a PostgreSQL database.

1. Open pgAdmin (or PostgreSQL command line).
2. Create a new database named `postgres` (or use the existing one).
3. Update the `.env` file located in the `backend/` folder (`backend/.env`):
   ```env
   # Update this with your PostgreSQL username and password
   # Format: postgres://username:password@localhost:5432/dbname
   DATABASE_URL=postgres://postgres:0108@localhost:5432/postgres
   ```
4. Initialize the tables by running the SQL schema. Open your terminal in the backend project folder and run this:
   *(Alternatively, copy the contents of `backend/db/schema.sql` into pgAdmin's query tool and run it).*

## 3. Starting the Backend Server
The backend is a Node.js/Express server that runs on port 5001.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary Node packages:
   ```bash
   npm install
   ```
3. *(First time only)* Initialize the Admin User database. Run the script we created earlier to correctly inject your admin password hash:
   ```bash
   node update_admin.js
   ```
4. Start the backend Node server:
   ```bash
   node index.js
   ```
   *You should see a message saying "Server is running on port 5001" and "Database connected successfully".* Keep this terminal window open.

## 4. Starting the Frontend App
The frontend is a React/Vite app that runs on port 5173.

1. Open a **new** terminal and navigate to the root directory `interior/` (not the backend folder).
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The terminal will give you a local URL (usually `http://localhost:5173/`). Open this URL in your browser.

---

### Admin Login Information
If you have successfully run the initial steps and `update_admin.js`, you can log into the `/admin/signin` page using:
- **Email:** `admin`
- **Password:** `admin123`



