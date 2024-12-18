# Billing System In React JS

This **Billing System** is a comprehensive, user-friendly application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows businesses to manage their billing operations efficiently, track transactions, and generate invoices. The system provides an intuitive interface for both users and administrators to interact with.

## Features :
 - **Invoice Generation**: Create and manage invoices with ease.
 - **Transaction History**: View and track past transactions.
 - **Admin Dashboard**: Access detailed reports and manage transactions.

## Tech Stack :
 - **Frontend**: React.js (Vite.js)
 - **Backend**: Node.js, Express.js
 - **Database**: MongoDB

## 📂 Project Structure
```
Billing-System/
├── frontend/        # Frontend-related files (UI, components, etc.)
│   ├── assets/      # Static files (CSS, JS, Images)
│   ├── components/  # Reusable UI components (header, footer, etc.)
│   ├── views/       # Frontend views (home, login, dashboard, etc.)
│   └── scripts/     # Core frontend functionalities (product handling, billing logic)
├── backend/         # Backend-related files (APIs, server, database)
│   ├── config/      # Configuration files (database connection, settings)
│   ├── controllers/ # Functions to handle requests and interact with the database
│   ├── models/      # Database models (schemas)
│   ├── routes/      # API routes for different functionalities
│   ├── scripts/     # Backend logic (billing calculations, inventory management)
│   └── utils/       # Backend utility functions (helpers, formatters)
└── admin/           # Admin panel-related files (admin dashboard, user management)
    ├── assets/      # Static files (CSS, JS, Images)
    ├── components/  # Reusable UI components (admin header, footer, etc.)
    ├── views/       # Admin views (user management, reports, etc.)
    └── scripts/     # Admin panel functionalities (CRUD operations, admin logic)
```

## **Project Setup**

### **Prerequisites**
 - Node.js (v14 or above)
 - MongoDB (local or cloud setup)
 - npm or yarn

### **Clone the repository:**
```bash
git clone https://github.com/nameissakthi/Billing-System.git
```

### **Navigate to the project directory**
```bash
  cd Billing-System
```

### Install dependencies for frontend and backend separately
**Tip:** To efficiently install dependencies for both frontend and backend simultaneously, use split terminals.

**Install frontend dependencies**
```bash
cd Billing-System/frontend
npm install
```

**Install admin dependencies**
```bash
cd Billing-System/admin
npm install
```

**Install backend dependencies**
```bash
cd backend
npm install
```

### Environment Variables
**Backend**
- Create a `.env` file in the `backend` directory.
- Add the following variables with appropriate values

```bash
# Database connection string
MONGODB_URI="mongodb://localhost:27017/your-database-name"
```
**Frontend & Admin**
- Create a `.env` file in the `frontend & Admin` directory
- Add the following variable:
```bash
# Backend URL (adjust if needed)
VITE_BACKEND_URL="http://localhost:4000" 
```

**Important**
- Replace all placeholders (e.g., your_database_name, your_email) with your actual values.
- Exclude the `.env` file from version control to protect sensitive information.

**Important:**

- **Separate terminals**: Run the commands in separate terminal windows or use `split terminal` to avoid conflicts.
- **Nodemon required**: Ensure you have `nodemon` installed globally to run the backend development servers using `npm run dev`. You can install it globally using `npm install -g nodemon`.

#### Start the backend server
- Navigate to the `backend` directory: `cd backend`
- Start the server: `npm run dev` (or npm start)
- You should see a message indicating the server is running, usually on port 4000 or you can specify it in the PORT environment variable inside `.env` file.

#### Start the frontend server:
- Navigate to the `frontend` directory: `cd frontend`
- Start the server: `npm run dev`

#### Start the admin server:
- Navigate to the `admin` directory: `cd admin`
- Start the server: `npm run dev`

## **Bonus**
Don't forget to star the repository and share your feedback!✨

## Authors
- [Sakthivel](https://github.com/nameissakthi)

## License
This project is licensed under the [MIT License](LICENSE).