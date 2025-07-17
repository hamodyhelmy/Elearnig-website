# EduTech Backend - Flask API

This is a Flask backend API for the EduTech course platform frontend application.

## Features

- **User Authentication**: Registration, login, logout, and session management
- **Course Management**: Course listing, search, and filtering
- **Enrollment System**: Course enrollment and user enrollment tracking
- **Database**: SQLite database with SQLAlchemy ORM
- **CORS Support**: Cross-origin requests enabled for frontend integration

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Courses
- `GET /api/courses` - Get all courses (supports search and category filtering)
- `GET /api/courses/<id>` - Get specific course details
- `GET /api/courses/categories` - Get available course categories

### Enrollments
- `GET /api/enrollments` - Get user's enrolled courses
- `POST /api/enroll` - Enroll in courses
- `DELETE /api/enrollments/<id>` - Unenroll from course

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/<id>` - Get specific user
- `PUT /api/users/<id>` - Update user
- `DELETE /api/users/<id>` - Delete user

## Database Models

### User
- id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- created_at
- enrollments (Relationship)

### Course
- id (Primary Key)
- title
- description
- image
- category
- level
- rating
- students
- duration
- instructor
- price
- created_at
- enrollments (Relationship)

### Enrollment
- id (Primary Key)
- user_id (Foreign Key)
- course_id (Foreign Key)
- enrolled_at
- Unique constraint on (user_id, course_id)

## Setup and Installation

1. **Install Dependencies**:
   ```bash
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run the Application**:
   ```bash
   python src/main.py
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5000
   - API Base URL: http://localhost:5000/api

## Configuration

- **Database**: SQLite database located at `src/database/app.db`
- **CORS**: Configured to allow requests from `http://localhost:3000` and `http://localhost:5173`
- **Session Management**: Flask sessions for user authentication
- **Debug Mode**: Enabled for development

## Sample Data

The application automatically creates 15 sample courses across different categories:
- Web Development (5 courses)
- Data Science (3 courses)
- Mobile Development (2 courses)
- Design (3 courses)
- Marketing (2 courses)

## Testing

All API endpoints have been tested and are working correctly:

1. **Authentication Flow**:
   - User registration works
   - User login works
   - Session management works
   - Authentication check works

2. **Course Management**:
   - Course listing works
   - Search and filtering work
   - Course details retrieval works

3. **Enrollment System**:
   - Course enrollment works
   - Enrollment tracking works
   - Duplicate enrollment prevention works

## Frontend Integration

The backend serves the compiled React frontend from the `src/static` directory and provides API endpoints for all frontend functionality. The frontend makes relative API calls to the backend endpoints.

## Security Features

- Password hashing using Werkzeug's security utilities
- Session-based authentication
- CORS protection
- SQL injection prevention through SQLAlchemy ORM
- Input validation on all endpoints

## Error Handling

- Comprehensive error handling with appropriate HTTP status codes
- Database rollback on errors
- Detailed error messages for debugging
- Graceful handling of duplicate data and constraint violations

