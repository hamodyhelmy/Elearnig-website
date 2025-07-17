# EduTech Fullstack Application - Combined Instructions

This archive contains both the main EduTech application and the newly created Admin Dashboard.

## Project Structure

- `frontend/`: Contains the original React frontend source code of the main application.
- `backend/`: Contains the Flask backend code for the main application, which also serves the *built* frontend.
- `admin_dashboard/`: Contains the Flask-based admin dashboard application.

## How to Run the Applications

To run the fullstack application, you will need to start both the main backend and the admin dashboard backend.

### 1. Running the Main EduTech Application

This will run the user-facing application.

1. **Navigate to the main backend directory**:
   ```bash
   cd edutech_fullstack/backend
   ```

2. **Activate the Python virtual environment**:
   ```bash
   source venv/bin/activate
   ```

3. **Install Python dependencies (if not already installed)**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask backend**:
   ```bash
   python src/main.py
   ```

5. **Access the main application in your browser**:
   Open your web browser and go to `http://localhost:5000`.

### 2. Running the Admin Dashboard

This will run the administrative interface.

1. **Navigate to the admin dashboard directory**:
   ```bash
   cd edutech_fullstack/admin_dashboard
   ```

2. **Activate the Python virtual environment**:
   ```bash
   source venv/bin/activate
   ```

3. **Install Python dependencies (if not already installed)**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask backend for the admin dashboard**:
   ```bash
   python src/main.py
   ```

5. **Access the admin dashboard in your browser**:
   Open your web browser and go to `http://localhost:5001`.

## Important Notes

- **Main Application Frontend**: The `frontend/` directory contains the *original source code* of the React application. The *built* version of the frontend (optimized for deployment) has been moved into the `backend/src/static` directory. You do **not** need to run `npm install` or `npm run dev` in the `frontend/` directory to run the fullstack application, as the backend serves the pre-built frontend.
- **Admin Dashboard Port**: The admin dashboard runs on port **5001** to avoid conflicts with the main application (port 5000).
- **Data Synchronization**: The admin dashboard automatically syncs data from the main EduTech application database at startup. Ensure the main application has been run at least once to populate its database.

## What I Did

1.  **Created the Main EduTech Backend**: Developed a Flask backend for your provided React frontend, handling user authentication, course management, and enrollment. This backend serves the compiled frontend files.
2.  **Created the Admin Dashboard**: Built a separate Flask application for administrative tasks. This dashboard allows you to:
    *   View and manage user accounts.
    *   View, add, and remove courses.
    *   View and manage course enrollments.
    *   See overall statistics like total users, courses, and enrollments.
3.  **Ensured Independence**: The admin dashboard is a completely separate application and does not modify the code of your original frontend or backend. It interacts with the same database as the main application to reflect real-time data.
4.  **Provided Comprehensive Instructions**: Created detailed `README.md` files for both the main backend and the admin dashboard, and this combined `instructions.md` file to guide you through setting up and running both parts of the application.
5.  **Packaged Everything**: Combined the original frontend source, the main backend (with its integrated frontend build), and the new admin dashboard into a single, easy-to-use zip file.

