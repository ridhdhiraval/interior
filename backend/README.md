# Interior Design Backend API

This is the Node.js + Express.js backend for the Interior Design application, using PostgreSQL for data storage.

## Tech Stack
- **Node.js**: Runtime
- **Express.js**: Web Framework
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Bcryptjs**: Password Hashing
- **Helmet**: Security Middleware
- **Morgan**: Logging Middleware
- **Dotenv**: Environment Variable Management

## Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL installed and running
- pgAdmin 4 for database management

### Installation
1. Navigate to the `backend` folder.
2. Run `npm install`.
3. Create a `.env` file based on the `.env` example.
4. Set up the database:
    - Create a database named `interior_db`.
    - Run the SQL script in `db/schema.sql` using pgAdmin or psql.
    - Run the SQL script in `db/seed.sql` for initial data.

### Running the Server
- Development: `npm run dev` (uses nodemon)
- Production: `npm start`

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login an existing user.

### Designs
- `GET /api/designs`: Get all designs for the logged-in user.
- `POST /api/designs`: Create a new design.
- `PUT /api/designs/:id`: Update an existing design.
- `DELETE /api/designs/:id`: Delete a design.

### Orders
- `GET /api/orders`: Get all orders for the logged-in user.
- `POST /api/orders`: Create a new order.
- `PUT /api/orders/:order_id`: Update order status.

### Admin
- `GET /api/admin/users`: Get all users (Admin only).
- `GET /api/admin/orders`: Get all orders with user details (Admin only).
- `GET /api/admin/analytics`: Get site-wide analytics (Admin only).
- `GET /api/admin/notifications`: Get admin notifications (Admin only).
- `PUT /api/admin/notifications/:id`: Mark a notification as read (Admin only).
