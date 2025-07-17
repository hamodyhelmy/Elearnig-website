from flask import Blueprint, jsonify, request
from src.models.user import Course, db

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/courses', methods=['GET'])
def get_courses():
    try:
        # Get query parameters for filtering
        search = request.args.get('search', '').lower()
        category = request.args.get('category', 'all')
        
        # Start with all courses
        query = Course.query
        
        # Apply search filter
        if search:
            query = query.filter(
                (Course.title.ilike(f'%{search}%')) |
                (Course.instructor.ilike(f'%{search}%')) |
                (Course.description.ilike(f'%{search}%'))
            )
        
        # Apply category filter
        if category != 'all':
            query = query.filter(Course.category == category)
        
        courses = query.all()
        return jsonify([course.to_dict() for course in courses]), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch courses'}), 500

@courses_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    try:
        course = Course.query.get_or_404(course_id)
        return jsonify(course.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Course not found'}), 404

@courses_bp.route('/courses/categories', methods=['GET'])
def get_categories():
    try:
        # Get unique categories from the database
        categories = db.session.query(Course.category).distinct().all()
        category_list = [cat[0] for cat in categories]
        return jsonify(category_list), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch categories'}), 500

