import React, { useState, useEffect } from 'react';
import Header from './src/components/Header';
import HomePage from './src/components/HomePage';
import CoursesPage from './src/components/CoursesPage';
import CartPage from './src/components/CartPage';
import CheckoutPage from './src/components/CheckoutPage';
import AboutPage from './src/components/AboutPage';
import ContactPage from './src/components/ContactPage';
import LoginPage from './src/components/LoginPage';
import Footer from './src/components/Footer';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
    loadCourses();
  }, []);

  useEffect(() => {
    loadEnrolledCourses();
  }, [user]);

  const loadCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      
      if (response.ok) {
        setCourses(data);
      } else {
        console.error('Failed to load courses:', data.error);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  // Add window focus listener to refresh courses when returning from admin dashboard
  useEffect(() => {
    const handleFocus = () => {
      loadCourses();
    };

    const handleMessage = (event) => {
      if (event.data && event.data.type === 'COURSES_UPDATED') {
        loadCourses();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrolledCourses = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/enrollments', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        const courseIds = data.enrollments.map(enrollment => enrollment.course_id);
        setEnrolledCourses(courseIds);
      }
    } catch (error) {
      console.error('Failed to load enrolled courses:', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter courses based on search and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Authentication functions
  const handleLogin = (userData) => {
    setUser(userData);
    setError('');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setError('');
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setEnrolledCourses([]);
      setCart([]);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setEnrolledCourses([]);
      setCart([]);
      setCurrentPage('home');
    }
  };

  // Cart functions
  const addToCart = (courseId) => {
    if (!cart.includes(courseId) && !enrolledCourses.includes(courseId)) {
      setCart([...cart, courseId]);
    }
  };

  const removeFromCart = (courseId) => {
    setCart(cart.filter(id => id !== courseId));
  };

  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      removeFromCart(courseId);
    }
  };

  const enrollFromCart = async () => {
    if (!user) {
      setError('Please login to enroll in courses');
      return;
    }

    try {
      // Get course details for the cart items
      const coursesToEnroll = cart.map(courseId => {
        const course = courses.find(c => c.id === courseId);
        return {
          id: course.id,
          title: course.title,
          price: course.price
        };
      });

      const response = await fetch('http://localhost:5000/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courses: coursesToEnroll
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setEnrolledCourses([...enrolledCourses, ...cart]);
        setCart([]);
        setError('');
        
        // Show success message (you can implement a toast notification here)
        console.log('Successfully enrolled in courses:', data.message);
      } else {
        setError(data.error || 'Failed to enroll in courses');
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      setError('Failed to enroll in courses. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        user={user} 
        cart={cart} 
        setIsMenuOpen={setIsMenuOpen} 
        isMenuOpen={isMenuOpen} 
        handleLogout={handleLogout} // Pass handleLogout to Header
      />
      {currentPage === 'home' && <HomePage courses={courses} setCurrentPage={setCurrentPage} />}
      {currentPage === 'courses' && (
        <CoursesPage 
          courses={courses} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          filteredCourses={filteredCourses} 
          user={user} 
          cart={cart} 
          enrolledCourses={enrolledCourses} 
          addToCart={addToCart} 
        />
      )}
      {currentPage === 'cart' && (
        <CartPage 
          cart={cart} 
          courses={courses} 
          removeFromCart={removeFromCart} 
          setCurrentPage={setCurrentPage} 
        />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage 
          cart={cart} 
          courses={courses} 
          setCurrentPage={setCurrentPage} 
          enrollFromCart={enrollFromCart} 
        />
      )}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'login' && (
        <LoginPage 
          handleLogin={handleLogin} 
          handleSignup={handleSignup} 
          setCurrentPage={setCurrentPage} 
          error={error} 
        />
      )}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
