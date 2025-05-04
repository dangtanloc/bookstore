# Bookstore Backend

A RESTful API for a bookstore application with user authentication and book management.

## Features

- User registration and login with email verification
- JWT-based authentication
- CRUD operations for books
- Book categorization and filtering
- Input validation
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bookstore
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
VERIFICATION_CODE_EXPIRY=3600
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/verify-email` - Verify user's email
- `POST /api/users/login` - Login user

### Books

- `GET /api/books` - Get all books (with optional category filter)
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book (requires authentication)
- `PATCH /api/books/:id` - Update a book (requires authentication)
- `DELETE /api/books/:id` - Delete a book (requires authentication)

## Request/Response Examples

### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Email
```http
POST /api/users/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "verificationCode": "123456"
}
```

### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Book
```http
POST /api/books
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 19.99,
  "rating": 4.5,
  "coverImage": "https://example.com/cover.jpg",
  "description": "A story of the fabulously wealthy Jay Gatsby...",
  "category": "Fiction"
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "error": "Error message description"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Email verification is required for account activation
- Input validation is implemented using express-validator
- CORS is enabled for cross-origin requests 