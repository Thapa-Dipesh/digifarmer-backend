# digifarmer-backend

A Node.js backend API for a maize disease detection mobile app built with Express, Prisma, and PostgreSQL. It supports user authentication, post creation (with image upload), likes, and comments.

## Features

- User registration and login (JWT-based authentication)
- Firebase token login support
- User profile update and logout
- Create, update, delete, and fetch posts (with image upload)
- Like/unlike posts
- Comment on posts (CRUD)
- Input validation with Joi
- File uploads with Multer
- Prisma ORM with PostgreSQL

## Project Structure

```
.
├── prisma/                 # Prisma schema and migrations
├── public/uploads/         # Uploaded images
├── src/
│   ├── config/             # Database and multer config
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Auth and validation middleware
│   ├── routes/             # Express route definitions
│   └── index.js            # App entry point
├── .env                    # Environment variables
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Thapa-Dipesh/digifarmer-backend
   cd digifarmer-backend
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
   JWT_SECRET=your_jwt_secret
   FIREBASE_TOKEN=your_firebase_token
   PORT=3000
   ```

4. **Run database migrations:**

   ```sh
   pnpm exec prisma migrate deploy
   ```

5. **Start the server:**

   ```sh
   pnpm run dev
   ```

   The server will run on `http://localhost:3000` by default.

## API Endpoints

### Auth

- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login with email or phone number
- `POST /api/v1/auth/loginfirebase` — Login with Firebase token
- `PUT /api/v1/auth/update/:id` — Update user profile
- `POST /api/v1/auth/logout` — Logout user

### Posts

- `POST /api/v1/posts/create` — Create a post (with images)
- `GET /api/v1/posts/all-posts` — Get all posts
- `GET /api/v1/posts/post/:id` — Get a single post
- `PATCH /api/v1/posts/post/:id` — Update a post
- `DELETE /api/v1/posts/post/:id` — Delete a post

### Likes

- `POST /api/v1/posts/post/:postId/like` — Like or unlike a post

### Comments

- `POST /api/v1/posts/post/:postId/comments` — Add a comment
- `GET /api/v1/posts/post/:postId/comments` — Get comments for a post
- `PATCH /api/v1/posts/comments/:commentId` — Update a comment
- `DELETE /api/v1/posts/comments/:commentId` — Delete a comment

## Notes

- Uploaded images are stored in `public/uploads/`.
- All protected routes require a valid JWT token in `Authorization` header as `Bearer <token>`.
- Prisma client is generated in `src/generated/prisma`.
