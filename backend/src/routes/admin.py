from flask import Blueprint, jsonify, request
from src.models.user import User, Course, Enrollment, db
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['GET'])
def get_users():
    """Get all users with enrollment counts"""
    try:
        users = User.query.all()
        users_data = []
        
        for user in users:
            user_dict = user.to_dict()
            user_dict['enrollment_count'] = len(user.enrollments)
            users_data.append(user_dict)
        
        return jsonify({
            'users': users_data,
            'total': len(users_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user and all their enrollments"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Delete all enrollments for this user
        Enrollment.query.filter_by(user_id=user_id).delete()
        
        # Delete the user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/courses', methods=['GET'])
def get_courses():
    """Get all courses with enrollment counts"""
    try:
        courses = Course.query.all()
        courses_data = []
        
        for course in courses:
            course_dict = course.to_dict()
            course_dict['enrollment_count'] = len(course.enrollments)
            courses_data.append(course_dict)
        
        return jsonify({
            'courses': courses_data,
            'total': len(courses_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/courses', methods=['POST'])
def add_course():
    """Add a new course"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['title', 'description', 'image', 'category', 'level', 'duration', 'instructor', 'price']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new course
        course = Course(
            title=data['title'],
            description=data['description'],
            image=data['image'],
            category=data['category'],
            level=data['level'],
            rating=data.get('rating', 0.0),
            students=data.get('students', 0),
            duration=data['duration'],
            instructor=data['instructor'],
            price=float(data['price'])
        )
        
        db.session.add(course)
        db.session.commit()
        
        return jsonify({
            'message': 'Course added successfully',
            'course': course.to_dict()
        }), 201
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': 'Invalid price value'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    """Delete a course and all its enrollments"""
    try:
        course = Course.query.get_or_404(course_id)
        
        # Delete all enrollments for this course
        Enrollment.query.filter_by(course_id=course_id).delete()
        
        # Delete the course
        db.session.delete(course)
        db.session.commit()
        
        return jsonify({'message': 'Course deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/enrollments', methods=['GET'])
def get_enrollments():
    """Get all enrollments with user and course details"""
    try:
        enrollments = Enrollment.query.all()
        enrollments_data = []
        
        for enrollment in enrollments:
            enrollment_dict = enrollment.to_dict()
            # Add user and course details
            if enrollment.user:
                enrollment_dict['user'] = {
                    'id': enrollment.user.id,
                    'username': enrollment.user.username,
                    'email': enrollment.user.email
                }
            if enrollment.course:
                enrollment_dict['course'] = {
                    'id': enrollment.course.id,
                    'title': enrollment.course.title,
                    'instructor': enrollment.course.instructor,
                    'price': enrollment.course.price
                }
            enrollments_data.append(enrollment_dict)
        
        return jsonify({
            'enrollments': enrollments_data,
            'total': len(enrollments_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/enrollments/<int:enrollment_id>', methods=['DELETE'])
def delete_enrollment(enrollment_id):
    """Delete an enrollment"""
    try:
        enrollment = Enrollment.query.get_or_404(enrollment_id)
        
        db.session.delete(enrollment)
        db.session.commit()
        
        return jsonify({'message': 'Enrollment deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/stats', methods=['GET'])
def get_stats():
    """Get dashboard statistics"""
    try:
        total_users = User.query.count()
        total_courses = Course.query.count()
        total_enrollments = Enrollment.query.count()
        
        # Calculate total revenue
        total_revenue = db.session.query(func.sum(Course.price)).join(
            Enrollment, Course.id == Enrollment.course_id
        ).scalar() or 0
        
        # Get recent enrollments
        recent_enrollments = Enrollment.query.order_by(
            Enrollment.enrolled_at.desc()
        ).limit(5).all()
        
        recent_enrollments_data = []
        for enrollment in recent_enrollments:
            enrollment_dict = enrollment.to_dict()
            if enrollment.user:
                enrollment_dict['user'] = {
                    'id': enrollment.user.id,
                    'username': enrollment.user.username
                }
            if enrollment.course:
                enrollment_dict['course'] = {
                    'id': enrollment.course.id,
                    'title': enrollment.course.title,
                    'price': enrollment.course.price
                }
            recent_enrollments_data.append(enrollment_dict)
        
        return jsonify({
            'total_users': total_users,
            'total_courses': total_courses,
            'total_enrollments': total_enrollments,
            'total_revenue': float(total_revenue),
            'recent_enrollments': recent_enrollments_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

