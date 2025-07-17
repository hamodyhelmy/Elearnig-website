# EduTech Fullstack Project - Integrated E-learning Application

This project is a comprehensive fullstack e-learning application that combines an interactive frontend built with React, a robust backend built with Flask, and a separate administrative dashboard for content and user management.

## Project Structure

The project consists of the following main parts:

-   `frontend/`: Contains the original source code for the main EduTech application's frontend, built with React.
-   `backend/`: Contains the backend code for the main EduTech application, built with Flask. This backend also serves the built frontend.
-   `admin_dashboard/`: Contains the Flask-based administrative dashboard application.

## Technologies Used

### Frontend:
-   **React:** A JavaScript library for building user interfaces.
-   **Vite:** A fast build tool for modern web projects.
-   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.

### Backend (Main Application & Admin Dashboard):
-   **Flask:** A micro web framework for Python.
-   **Python:** The programming language used for the backend.
-   **SQLite:** A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. (Used for development/local setup)
-   **SQLAlchemy:** The Python SQL Toolkit and Object Relational Mapper that gives developers the full power of SQL.
-   **Flask-RESTful:** An extension for Flask that adds support for quickly building REST APIs.
-   **Flask-CORS:** A Flask extension for handling Cross Origin Resource Sharing (CORS), making cross-domain AJAX possible.
-   **Other Python Libraries:** (Based on typical Flask project requirements, specific libraries would be listed in `requirements.txt`)
    -   `requests`
    -   `bcrypt` (for password hashing)
    -   `PyJWT` (for token-based authentication)

## How to Run the Applications

To run the fullstack application, you will need to start both the main backend and the admin dashboard backend separately.

### 1. Running the Main EduTech Application

This will run the user-facing application.

1.  **Navigate to the main backend directory**:
    ```bash
    cd backend
    ```

2.  **Activate the Python virtual environment**:
    ```bash
    source venv/bin/activate
    ```

3.  **Install Python dependencies (if not already installed)**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask backend**:
    ```bash
    python src/main.py
    ```

5.  **Access the main application in your browser**:
    Open your web browser and go to `http://localhost:5000`.

### 2. Running the Admin Dashboard

This will run the administrative interface.

1.  **Navigate to the admin dashboard directory**:
    ```bash
    cd admin_dashboard
    ```

2.  **Activate the Python virtual environment**:
    ```bash
    source venv/bin/activate
    ```

3.  **Install Python dependencies (if not already installed)**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask backend for the admin dashboard**:
    ```bash
    python src/main.py
    ```

5.  **Access the admin dashboard in your browser**:
    Open your web browser and go to `http://localhost:5001`.

## Important Notes

-   **Main Application Frontend**: The `frontend/` directory contains the *original source code* of the React application. The *built* version of the frontend (optimized for deployment) has been moved into the `backend/src/static` directory. You do **not** need to run `npm install` or `npm run dev` in the `frontend/` directory to run the fullstack application, as the backend serves the pre-built frontend.
-   **Admin Dashboard Port**: The admin dashboard runs on port **5001** to avoid conflicts with the main application (port 5000).
-   **Data Synchronization**: The admin dashboard automatically syncs data from the main EduTech application database at startup. Ensure the main application has been run at least once to populate its database.

## Key Features

-   **User-Facing E-learning Application**: Interactive frontend for displaying courses, managing shopping cart, and checkout processes.
-   **Robust Backend**: Manages users, courses, and enrollments.
-   **Separate Administrative Dashboard**: The admin dashboard allows you to manage:
    *   User accounts.
    *   Courses (view, add, remove).
    *   Course enrollments.
    *   General statistics (total users, courses, enrollments).
-   **Independent Admin Dashboard**: The admin dashboard is a completely separate application and does not modify the code of your original frontend or backend. It interacts with the same database as the main application to reflect real-time data.

## Deployment

For instructions on deploying this project to platforms like GitHub Pages, Netlify, Vercel (for the frontend) and Heroku, Render, AWS Elastic Beanstalk (for the backend), please refer to the documentation for those platforms. Remember to configure environment variables and update backend URLs in the frontend after deployment.

