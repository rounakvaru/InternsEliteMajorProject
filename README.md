# TaskFlow - Full-Stack MERN Task Manager Application

TaskFlow is a production-ready, full-stack productivity web application designed to help users manage tasks efficiently. It features a secure workspace architecture, protected API routing, dynamic searching/sorting/filtering, real-time metrics, and a sleek, glassmorphic modern UI theme with responsive support.

## 🚀 Key Features

1. **Secure Authentication & Authorization**
   - User Sign Up and Sign In pages with real-time client-side forms validation.
   - Secure passwords hashed using `bcrypt` before storage.
   - Stateless session protection via JSON Web Tokens (JWT) sent via headers.
   - Ownership validations ensuring users can only read, create, update, or delete their own tasks.

2. **Full CRUD Task Management**
   - Create tasks with a Title, Description, Priority level, and Due Date.
   - Read and manage all tasks from a responsive cards grid.
   - Toggle completion status directly from the card.
   - Edit tasks via an interactive popup modal.
   - Delete single tasks or clear all completed tasks in bulk.

3. **Searching, Filtering & Sorting**
   - Real-time text search matches words in both titles and descriptions.
   - Filter workspace tasks by Completion status (All, Completed, Pending) and Priority (All, Low, Medium, High).
   - Sort tasks by Creation date (Newest / Oldest), Due Date, and Priority weight (High → Medium → Low).

4. **Real-time Statistics Dashboard**
   - Display key progress indicators dynamically:
     - **Total Tasks**: Overall number of tasks created.
     - **Completed Tasks**: Tasks completed successfully.
     - **Pending Tasks**: Work currently in progress.
     - **Overdue Tasks**: Active tasks with due dates in the past (highlighted with indicator alert styles).

5. **Premium UX Design Details**
   - Sleek responsive glassmorphic cards and containers.
   - Dynamic dark/light mode toggle.
   - Float-in toast alert notifications for success/error statuses.
   - Double-check safety dialogs for delete actions.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Lucide Icons, Axios, CSS Variable custom themes (Vanilla CSS).
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password encryption (`bcryptjs`), Request Logger (`morgan`), CORS.
- **Database**: MongoDB, Mongoose (Object Data Modeling).

---

## 📂 Project Structure

```
d:/Rounak/
├── backend/
│   ├── config/db.js              # MongoDB Connection
│   ├── controllers/
│   │   ├── authController.js     # Signup, Login, Profile controllers
│   │   └── taskController.js     # CRUD, Stats, Sorting/Filtering controllers
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Token validation
│   │   ├── errorMiddleware.js    # Express central error handler
│   │   └── validateMiddleware.js # Input parameters validation middleware
│   ├── models/
│   │   ├── User.js               # User MongoDB Schema
│   │   └── Task.js               # Task MongoDB Schema
│   ├── routes/
│   │   ├── authRoutes.js         # Register, Login, Profile endpoints
│   │   └── taskRoutes.js         # Task CRUD, stats endpoints
│   ├── .env                      # Environment Variables
│   ├── package.json
│   └── server.js                 # Backend Server entry
│
└── frontend/
    ├── src/
    │   ├── components/           # Navbar, TaskCard, Modals, Forms
    │   ├── context/              # Auth, Theme, Toast Context providers
    │   ├── styles/               # Glassmorphic themes, responsive grids, overlays
    │   ├── utils/api.js          # Axios configuration and interceptors
    │   ├── App.jsx               # Navigation router/state switch
    │   └── main.jsx              # React Entry point
    ├── index.html
    └── package.json
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally OR a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud database.

### Step 1: Clone and Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Configure the environment variables in a file named `.env` in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=your_custom_ultra_secure_secret_key_string
   NODE_ENV=development
   ```
   *(Replace `mongodb://127.0.0.1:27017/taskmanager` with your Atlas Connection String if using the cloud).*

4. Start the server:
   ```bash
   # Production mode
   npm start
   
   # Dev mode (requires nodemon)
   npm run dev
   ```

### Step 2: Set Up the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at the local URL (usually `http://localhost:5173`).

---

## 🔌 API Documentation

All request bodies must be sent in `application/json` format. Headers for protected routes must include: `Authorization: Bearer <your_jwt_token>`.

### Authentication Endpoints

#### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f53112423001f3a5f",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  }
  ```

#### 2. User Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f53112423001f3a5f",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  }
  ```

#### 3. Fetch User Profile
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Access**: Private (Requires JWT Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f53112423001f3a5f",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-07-24T16:00:00.000Z"
    }
  }
  ```

---

### Task Management Endpoints

#### 1. Fetch Tasks (with Searching, Sorting, Filtering)
- **URL**: `/api/tasks`
- **Method**: `GET`
- **Access**: Private (Requires JWT Bearer Token)
- **Query Parameters (Optional)**:
  - `status`: `all` | `pending` | `completed`
  - `priority`: `Low` | `Medium` | `High`
  - `search`: Searches titles/descriptions.
  - `sortBy`: `newest` | `oldest` | `dueDate` | `priority`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d0fe7a53112423001f3a61",
        "title": "Complete MERN Project",
        "description": "Develop and review MERN app code files.",
        "priority": "High",
        "dueDate": "2026-07-26T00:00:00.000Z",
        "completed": false,
        "owner": "60d0fe4f53112423001f3a5f",
        "createdAt": "2026-07-24T16:10:00.000Z",
        "updatedAt": "2026-07-24T16:10:00.000Z"
      }
    ]
  }
  ```

#### 2. Create Task
- **URL**: `/api/tasks`
- **Method**: `POST`
- **Access**: Private (Requires JWT Bearer Token)
- **Request Body**:
  ```json
  {
    "title": "Complete MERN Project",
    "description": "Develop and review MERN app code files.",
    "priority": "High",
    "dueDate": "2026-07-26"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe7a53112423001f3a61",
      "title": "Complete MERN Project",
      "description": "Develop and review MERN app code files.",
      "priority": "High",
      "dueDate": "2026-07-26T00:00:00.000Z",
      "completed": false,
      "owner": "60d0fe4f53112423001f3a5f",
      "createdAt": "2026-07-24T16:10:00.000Z"
    }
  }
  ```

#### 3. Update Task Details or Completion status
- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **Access**: Private (Requires JWT Bearer Token)
- **Request Body (Partial parameters supported)**:
  ```json
  {
    "completed": true
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe7a53112423001f3a61",
      "title": "Complete MERN Project",
      "completed": true,
      "updatedAt": "2026-07-24T16:20:00.000Z"
    }
  }
  ```

#### 4. Delete Single Task
- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Access**: Private (Requires JWT Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task removed successfully"
  }
  ```

#### 5. Clear All Completed Tasks
- **URL**: `/api/tasks/completed`
- **Method**: `DELETE`
- **Access**: Private (Requires JWT Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "3 completed tasks deleted",
    "deletedCount": 3
  }
  ```

#### 6. Fetch Workspace Task Statistics
- **URL**: `/api/tasks/stats`
- **Method**: `GET`
- **Access**: Private (Requires JWT Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "total": 5,
      "completed": 3,
      "pending": 2,
      "overdue": 1
    }
  }
  ```
