import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.courses import courses_bp
from src.routes.enrollments import enrollments_bp
from src.routes.admin import admin_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:5173'])

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(courses_bp, url_prefix="/api")
app.register_blueprint(enrollments_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize database and add sample data
with app.app_context():
    db.create_all()
    
    # Add sample courses if none exist
    from src.models.user import Course, User
    
    # Create admin user if none exists
    admin_user = User.query.filter_by(is_admin=True).first()
    if not admin_user:
        admin = User(
            username='admin',
            email='admin@edutech.com',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Admin user created: username=admin, password=admin123")
    
    if Course.query.count() == 0:
        sample_courses = [
            {
                'title': 'Web Development Bootcamp',
                'description': 'Learn to build websites from scratch using HTML, CSS, JavaScript, and React.',
                'image': './src/assets/images/web-development-bootcamp.jpg',
                'category': 'web-development',
                'level': 'Beginner',
                'rating': 4.5,
                'students': 150,
                'duration': '30 hours',
                'instructor': 'John Doe',
                'price': 99
            },
            {
                'title': 'React Masterclass',
                'description': 'Learn to build dynamic UIs with React, Hooks, and Context API.',
                'image': './src/assets/images/react-masterclass.jpg',
                'category': 'web-development',
                'level': 'Intermediate',
                'rating': 4.6,
                'students': 210,
                'duration': '25 hours',
                'instructor': 'Sarah Lee',
                'price': 129
            },
            {
                'title': 'Full Stack Development with Node.js',
                'description': 'Build complete web apps using Express, MongoDB, and REST APIs.',
                'image': './src/assets/images/fullstack-nodejs.png',
                'category': 'web-development',
                'level': 'Advanced',
                'rating': 4.7,
                'students': 180,
                'duration': '40 hours',
                'instructor': 'Michael Chen',
                'price': 199
            },
            {
                'title': 'Data Science with Python',
                'description': 'Master data analysis and visualization using Python and Pandas.',
                'image': './src/assets/images/data-science-python.png',
                'category': 'data-science',
                'level': 'Intermediate',
                'rating': 4.7,
                'students': 200,
                'duration': '40 hours',
                'instructor': 'Jane Smith',
                'price': 149
            },
            {
                'title': 'Intro to Machine Learning',
                'description': 'Understand the basics of ML and implement real-world projects.',
                'image': './src/assets/images/machine-learning.png',
                'category': 'data-science',
                'level': 'Intermediate',
                'rating': 4.6,
                'students': 320,
                'duration': '35 hours',
                'instructor': 'Dr. Emily White',
                'price': 179
            },
            {
                'title': 'Mobile App Development',
                'description': 'Create mobile applications for iOS and Android using React Native.',
                'image': './src/assets/images/mobile-app-development.png',
                'category': 'mobile-development',
                'level': 'Advanced',
                'rating': 4.8,
                'students': 300,
                'duration': '50 hours',
                'instructor': 'Alice Johnson',
                'price': 199
            },
            {
                'title': 'Flutter for Beginners',
                'description': 'Learn to build beautiful mobile apps using Flutter and Dart.',
                'image': './src/assets/images/flutter-beginners.webp',
                'category': 'mobile-development',
                'level': 'Beginner',
                'rating': 4.5,
                'students': 400,
                'duration': '45 hours',
                'instructor': 'David Kim',
                'price': 139
            },
            {
                'title': 'UI/UX Design Fundamentals',
                'description': 'Master user interface and experience design principles.',
                'image': './src/assets/images/ui-ux-design.jpeg',
                'category': 'design',
                'level': 'Beginner',
                'rating': 4.4,
                'students': 250,
                'duration': '20 hours',
                'instructor': 'Linda Park',
                'price': 89
            },
            {
                'title': 'Figma for UI Design',
                'description': 'Learn how to design responsive websites using Figma.',
                'image': './src/assets/images/figma-ui-design.jpg',
                'category': 'design',
                'level': 'Intermediate',
                'rating': 4.6,
                'students': 180,
                'duration': '15 hours',
                'instructor': 'Chris Evans',
                'price': 79
            },
            {
                'title': 'Digital Marketing for Beginners',
                'description': 'Start your journey in digital marketing with SEO, SEM, and social media.',
                'image': './src/assets/images/digital-marketing.jpg',
                'category': 'marketing',
                'level': 'Beginner',
                'rating': 4.3,
                'students': 500,
                'duration': '25 hours',
                'instructor': 'Rachel Green',
                'price': 69
            },
            {
                'title': 'Advanced SEO Strategies',
                'description': 'Master advanced SEO techniques to grow organic traffic.',
                'image': './src/assets/images/advanced-seo.png',
                'category': 'marketing',
                'level': 'Advanced',
                'rating': 4.7,
                'students': 120,
                'duration': '20 hours',
                'instructor': 'Mark Thompson',
                'price': 119
            },
            {
                'title': 'Python for Data Analysis',
                'description': 'Learn how to use Python for analyzing and visualizing data.',
                'image': './src/assets/images/python-data-analysis.jpg',
                'category': 'data-science',
                'level': 'Intermediate',
                'rating': 4.5,
                'students': 270,
                'duration': '30 hours',
                'instructor': 'Daniel Wong',
                'price': 129
            },
            {
                'title': 'Graphic Design for Beginners',
                'description': 'Learn the fundamentals of Adobe Photoshop and Illustrator.',
                'image': './src/assets/images/graphic-design.jpg',
                'category': 'design',
                'level': 'Beginner',
                'rating': 4.4,
                'students': 350,
                'duration': '20 hours',
                'instructor': 'Olivia Moore',
                'price': 99
            },
            {
                'title': 'Social Media Marketing',
                'description': 'Create powerful campaigns on Facebook, Instagram, and LinkedIn.',
                'image': './src/assets/images/social-media-marketing.jpg',
                'category': 'marketing',
                'level': 'Intermediate',
                'rating': 4.5,
                'students': 410,
                'duration': '22 hours',
                'instructor': 'Sophia Lee',
                'price': 89
            },
            {
                'title': 'Advanced JavaScript Concepts',
                'description': 'Deep dive into closures, async programming, and ES6+ features.',
                'image': './src/assets/images/advanced-javascript.png',
                'category': 'web-development',
                'level': 'Advanced',
                'rating': 4.8,
                'students': 190,
                'duration': '20 hours',
                'instructor': 'Lisa Thompson',
                'price': 49.99
            }
        ]
        
        for course_data in sample_courses:
            course = Course(**course_data)
            db.session.add(course)
        
        db.session.commit()
        print("Sample courses added to database")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
