
# Project Overview: Polling & Feedback Application

A full-stack web application designed for creating, sharing, and participating in interactive polls and feedback sessions.

## Project Vision
The Polling & Feedback Application aims to provide a seamless platform for users to engage in community-driven decision-making. Users can create custom polls with multiple options, cast votes, and participate in discussions through comments.

## Technology Stack

### Backend (Node.js & Express)
- **Framework**: [Express.js](https://expressjs.com/) for building the RESTful API.
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for data modeling and ORM.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for secure user sessions and password hashing.
- **Middleware**: [CORS](https://github.com/expressjs/cors) for cross-origin resource sharing and [Morgan](https://github.com/expressjs/morgan) for HTTP request logging.

### Frontend (React & Vite)
- **Library**: [React 19](https://react.dev/) for building the user interface.
- **Build Tool**: [Vite](https://vitejs.dev/) for a fast and modern development environment.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first design and [Lucide-React](https://lucide.dev/) for iconography.
- **Routing**: [React Router DOM v7](https://reactrouter.com/) for client-side navigation.
- **State Management**: [React Context API](https://react.dev/learn/passing-data-deeply-with-context) for global authentication state.
- **Visualization**: [Recharts](https://recharts.org/) for displaying poll results dynamically.
- **API Communication**: [Axios](https://axios-http.com/) for managing HTTP requests to the backend.

## Core Features
1. **User Authentication**: Secure signup and login functionality.
2. **Poll Creation**: Registered users can create polls with custom titles, descriptions, and multiple options.
3. **Voting System**: Real-time voting on active polls.
4. **Commenting**: Discussion threads on individual polls for community feedback.
5. **Poll Management**: Creators can close or delete their polls.
6. **Responsive Design**: Optimized for both desktop and mobile devices.

## Directory Structure

```text
intershipproject/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components (e.g., Navbar)
│   │   ├── context/    # Global state management
│   │   ├── pages/      # Individual page components (Home, Login, CreatePoll, etc.)
│   │   ├── utils/      # Helper functions and API utilities
│   │   └── App.jsx     # Main application component and routing
│   └── package.json    # Frontend dependencies and scripts
└── server/             # Node.js Express backend
    ├── controllers/    # Business logic for routes
    ├── middleware/     # Custom auth and error handling
    ├── models/         # Mongoose schemas (User, Poll, Comment, Vote)
    ├── routes/         # API endpoint definitions
    ├── index.js        # Server entry point
    └── .env            # Environment configuration
```

## Key API Endpoints
- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Authenticate an existing user.
- `GET /api/polls`: Fetch all active polls.
- `POST /api/polls`: Create a new poll (Authenticated).
- `POST /api/polls/:id/vote`: Cast a vote on a specific poll (Authenticated).
- `POST /api/comments/:pollId`: Add a comment to a poll (Authenticated).
