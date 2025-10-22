# Escape Room Team Management App

A full-stack web application built with React, Node.js/Express, and PostgreSQL for managing escape room teams.

## Features

- Simple user registration with email, password, and name
- Basic team creation
- Simple JWT authentication
- Basic login/register pages
- Responsive React frontend

## Project Structure

```
escape-room-app/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utilities and context
├── backend/           # Express.js API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── controllers/   # Route controllers
│   │   └── utils/         # Database and utilities
└── database/          # Database schema
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Install PostgreSQL

2. Create `.env` file in backend directory:
```bash
cp backend/.env.example backend/.env
```

3. Update `backend/.env` with your database credentials:
```
PORT=5000
JWT_SECRET=secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=escape_room_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

4. Run the database setup script:
```bash
npm run setup:db
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

### Running Both Servers

From the root directory:
```bash
npm run install:all
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - Get user's teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:id/members` - Get team members
- `POST /api/teams/:id/members` - Add team member

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/search` - Search users by email

## Basic Features

- Simple JWT authentication
- Basic user and team management
- Minimal validation

## Technologies Used

### Frontend
- React 18
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- bcryptjs
- Helmet
- CORS

## Development

The application runs on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## License

MIT License