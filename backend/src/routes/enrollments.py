from flask import Blueprint, jsonify, request, session
from src.models.user import User, Course, Enrollment, db
from sqlalchemy.exc import IntegrityError

enrollments_bp = Blueprint('enrollments', __name__)

@enrollments_bp.route('/enrollments', methods=['GET'])
def get_user_enrollments():
    try:
        # Check if user is authenticated
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        user_id = session['user_id']
        enrollments = Enrollment.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'enrollments': [enrollment.to_dict() for enrollment in enrollments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch enrollments'}), 500

@enrollments_bp.route('/enroll', methods=['POST'])
def enroll_in_courses():
    try:
        # Check if user is authenticated
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.json
        user_id = session['user_id']
        
        if not data.get('courses'):
            return jsonify({'error': 'No courses provided'}), 400
        
        enrolled_courses = []
        errors = []
        
        for course_data in data['courses']:
            course_id = course_data.get('id')
            
            if not course_id:
                errors.append('Course ID is required')
                continue
            
            # Check if course exists
            course = Course.query.get(course_id)
            if not course:
                errors.append(f'Course with ID {course_id} not found')
                continue
            
            # Check if already enrolled
            existing_enrollment = Enrollment.query.filter_by(
                user_id=user_id, 
                course_id=course_id
            ).first()
            
            if existing_enrollment:
                errors.append(f'Already enrolled in {course.title}')
                continue
            
            # Create enrollment
            try:
                enrollment = Enrollment(user_id=user_id, course_id=course_id)
                db.session.add(enrollment)
                enrolled_courses.append(course.title)
            except Exception as e:
                errors.append(f'Failed to enroll in {course.title}')
        
        # Commit all enrollments
        if enrolled_courses:
            db.session.commit()
        
        response_data = {
            'message': f'Successfully enrolled in {len(enrolled_courses)} course(s)',
            'enrolled_courses': enrolled_courses
        }
        
        if errors:
            response_data['errors'] = errors
        
        return jsonify(response_data), 200 if enrolled_courses else 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Enrollment failed'}), 500

@enrollments_bp.route('/enrollments/<int:enrollment_id>', methods=['DELETE'])
def unenroll_from_course(enrollment_id):
    try:
        # Check if user is authenticated
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        user_id = session['user_id']
        
        # Find enrollment and verify it belongs to the current user
        enrollment = Enrollment.query.filter_by(
            id=enrollment_id, 
            user_id=user_id
        ).first()
        
        if not enrollment:
            return jsonify({'error': 'Enrollment not found'}), 404
        
        db.session.delete(enrollment)
        db.session.commit()
        
        return jsonify({'message': 'Successfully unenrolled from course'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to unenroll from course'}), 500

