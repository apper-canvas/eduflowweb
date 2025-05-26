import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [facultyFilter, setFacultyFilter] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [coursesPerPage] = useState(9)

  // Load data from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem('eduflow_courses')
    const savedStudents = localStorage.getItem('eduflow_students')
    
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    } else {
      // Initialize with sample data
      const sampleCourses = [
        {
          id: 1,
          code: 'CS101',
          name: 'Introduction to Computer Science',
          department: 'Computer Science',
          faculty: 'Dr. Smith',
          credits: 3,
          semester: 'Fall 2024',
          schedule: {
            days: ['Monday', 'Wednesday', 'Friday'],
            startTime: '09:00',
            endTime: '10:30',
            room: 'CS-101'
          },
          capacity: 30,
          enrolled: 28,
          fee: 1200,
          description: 'Fundamental concepts of computer science including programming basics, algorithms, and problem-solving techniques.'
        },
        {
          id: 2,
          code: 'MATH201',
          name: 'Calculus II',
          department: 'Mathematics',
          faculty: 'Dr. Johnson',
          credits: 4,
          semester: 'Fall 2024',
          schedule: {
            days: ['Tuesday', 'Thursday'],
            startTime: '14:00',
            endTime: '16:00',
            room: 'MATH-205'
          },
          capacity: 25,
          enrolled: 22,
          fee: 1500,
          description: 'Advanced calculus covering integration techniques, series, and multivariable calculus.'
        },
        {
          id: 3,
          code: 'ENG101',
          name: 'English Composition',
          department: 'English',
          faculty: 'Prof. Williams',
          credits: 3,
          semester: 'Fall 2024',
          schedule: {
            days: ['Monday', 'Wednesday'],
            startTime: '11:00',
            endTime: '12:30',
            room: 'ENG-102'
          },
          capacity: 20,
          enrolled: 18,
          fee: 1000,
          description: 'Fundamentals of academic writing, critical thinking, and communication skills.'
        }
      ]
      setCourses(sampleCourses)
      localStorage.setItem('eduflow_courses', JSON.stringify(sampleCourses))
    }

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    }
  }, [])

  // Save courses to localStorage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('eduflow_courses', JSON.stringify(courses))
    }
  }, [courses])

  // Filter and search courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.faculty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !departmentFilter || course.department === departmentFilter
    const matchesFaculty = !facultyFilter || course.faculty === facultyFilter
    const matchesSemester = !semesterFilter || course.semester === semesterFilter
    
    return matchesSearch && matchesDepartment && matchesFaculty && matchesSemester
  })

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  // Get unique values for filters
  const departments = [...new Set(courses.map(course => course.department))]
  const faculties = [...new Set(courses.map(course => course.faculty))]
  const semesters = [...new Set(courses.map(course => course.semester))]

  // Check for schedule conflicts
  const checkScheduleConflict = (newSchedule, excludeId = null) => {
    return courses.some(course => {
      if (excludeId && course.id === excludeId) return false
      
      const hasTimeOverlap = newSchedule.startTime < course.schedule.endTime && 
                            newSchedule.endTime > course.schedule.startTime
      const hasDayOverlap = newSchedule.days.some(day => course.schedule.days.includes(day))
      const sameRoom = newSchedule.room === course.schedule.room
      const sameFaculty = newSchedule.faculty === course.faculty
      
      return hasTimeOverlap && hasDayOverlap && (sameRoom || sameFaculty)
    })
  }

  // Handle course operations
  const handleAddCourse = async (courseData) => {
    setLoading(true)
    try {
      // Check for schedule conflicts
      if (checkScheduleConflict({ ...courseData.schedule, faculty: courseData.faculty })) {
        toast.error('Schedule conflict detected! Please choose different time/room.')
        setLoading(false)
        return
      }

      const newCourse = {
        ...courseData,
        id: Date.now(),
        enrolled: 0
      }
      
      setCourses(prev => [...prev, newCourse])
      setShowAddModal(false)
      toast.success(`Course ${courseData.code} added successfully!`)
    } catch (error) {
      toast.error('Failed to add course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditCourse = async (courseData) => {
    setLoading(true)
    try {
      // Check for schedule conflicts (excluding current course)
      if (checkScheduleConflict({ ...courseData.schedule, faculty: courseData.faculty }, selectedCourse.id)) {
        toast.error('Schedule conflict detected! Please choose different time/room.')
        setLoading(false)
        return
      }

      setCourses(prev => prev.map(course => 
        course.id === selectedCourse.id ? { ...course, ...courseData } : course
      ))
      setShowEditModal(false)
      setSelectedCourse(null)
      toast.success(`Course ${courseData.code} updated successfully!`)
    } catch (error) {
      toast.error('Failed to update course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setLoading(true)
      try {
        setCourses(prev => prev.filter(course => course.id !== courseId))
        toast.success('Course deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete course. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const getEnrollmentStatus = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100
    if (percentage >= 90) return { status: 'Full', color: 'text-red-600', bg: 'bg-red-100' }
    if (percentage >= 75) return { status: 'Almost Full', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { status: 'Available', color: 'text-green-600', bg: 'bg-green-100' }
  }

  return (
    <motion.div 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
              Course Management
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Manage courses, schedules, and enrollments
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            Add Course
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-100 dark:border-surface-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Faculty</option>
            {faculties.map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
          
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {currentCourses.map((course) => {
            const enrollmentStatus = getEnrollmentStatus(course.enrolled, course.capacity)
            
            return (
              <motion.div
                key={course.id}
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-100 dark:border-surface-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
                        {course.code}
                      </h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm">
                        {course.name}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollmentStatus.bg} ${enrollmentStatus.color}`}>
                      {enrollmentStatus.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Building" className="w-4 h-4" />
                      {course.department}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="User" className="w-4 h-4" />
                      {course.faculty}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      {course.schedule.days.join(', ')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      {course.schedule.startTime} - {course.schedule.endTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Enrolled: </span>
                      <span className="font-semibold text-surface-900 dark:text-white">
                        {course.enrolled}/{course.capacity}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Credits: </span>
                      <span className="font-semibold text-surface-900 dark:text-white">
                        {course.credits}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course)
                        setShowDetailModal(true)
                      }}
                      className="flex-1 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCourse(course)
                        setShowEditModal(true)
                      }}
                      className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-primary text-white border-primary'
                  : 'border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Course Modal */}
      <CourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCourse}
        title="Add New Course"
        loading={loading}
      />

      {/* Edit Course Modal */}
      <CourseModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedCourse(null)
        }}
        onSubmit={handleEditCourse}
        course={selectedCourse}
        title="Edit Course"
        loading={loading}
      />

      {/* Course Detail Modal */}
      <CourseDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedCourse(null)
        }}
        course={selectedCourse}
        students={students}
      />
    </motion.div>
  )
}

// Course Form Modal Component
const CourseModal = ({ isOpen, onClose, onSubmit, course, title, loading }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    faculty: '',
    credits: 3,
    semester: '',
    capacity: 30,
    fee: 1000,
    description: '',
    schedule: {
      days: [],
      startTime: '09:00',
      endTime: '10:30',
      room: ''
    }
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (course) {
      setFormData(course)
    } else {
      setFormData({
        code: '',
        name: '',
        department: '',
        faculty: '',
        credits: 3,
        semester: '',
        capacity: 30,
        fee: 1000,
        description: '',
        schedule: {
          days: [],
          startTime: '09:00',
          endTime: '10:30',
          room: ''
        }
      })
    }
    setErrors({})
  }, [course, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.code.trim()) newErrors.code = 'Course code is required'
    if (!formData.name.trim()) newErrors.name = 'Course name is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    if (!formData.faculty.trim()) newErrors.faculty = 'Faculty is required'
    if (!formData.semester.trim()) newErrors.semester = 'Semester is required'
    if (!formData.schedule.room.trim()) newErrors.room = 'Room is required'
    if (formData.schedule.days.length === 0) newErrors.days = 'At least one day must be selected'
    if (formData.credits < 1 || formData.credits > 6) newErrors.credits = 'Credits must be between 1 and 6'
    if (formData.capacity < 1 || formData.capacity > 100) newErrors.capacity = 'Capacity must be between 1 and 100'
    if (formData.fee < 0) newErrors.fee = 'Fee cannot be negative'

    if (formData.schedule.startTime >= formData.schedule.endTime) {
      newErrors.time = 'End time must be after start time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: prev.schedule.days.includes(day)
          ? prev.schedule.days.filter(d => d !== day)
          : [...prev.schedule.days, day]
      }
    }))
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const departments = ['Computer Science', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Economics']
  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Code */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Course Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:ring-2 focus:ring-primary/20 ${
                  errors.code ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
                placeholder="e.g., CS101"
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
                placeholder="e.g., Introduction to Computer Science"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 ${
                  errors.department ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Faculty */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Faculty *
              </label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:ring-2 focus:ring-primary/20 ${
                  errors.faculty ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
                placeholder="e.g., Dr. Smith"
              />
              {errors.faculty && <p className="text-red-500 text-sm mt-1">{errors.faculty}</p>}
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Credits *
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 ${
                  errors.credits ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
              />
              {errors.credits && <p className="text-red-500 text-sm mt-1">{errors.credits}</p>}
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 ${
                  errors.semester ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
              {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 ${
                  errors.capacity ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>

            {/* Fee */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Course Fee ($) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.fee}
                onChange={(e) => setFormData(prev => ({ ...prev, fee: parseFloat(e.target.value) }))}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary/20 ${
                  errors.fee ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                }`}
              />
              {errors.fee && <p className="text-red-500 text-sm mt-1">{errors.fee}</p>}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Schedule</h3>
            
            {/* Days */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Days *
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayChange(day)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.schedule.days.includes(day)
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
              {errors.days && <p className="text-red-500 text-sm mt-1">{errors.days}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.schedule.startTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, startTime: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.schedule.endTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, endTime: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Room *
                </label>
                <input
                  type="text"
                  value={formData.schedule.room}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, room: e.target.value }
                  }))}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:ring-2 focus:ring-primary/20 ${
                    errors.room ? 'border-red-500' : 'border-surface-300 dark:border-surface-600 focus:border-primary'
                  }`}
                  placeholder="e.g., CS-101"
                />
                {errors.room && <p className="text-red-500 text-sm mt-1">{errors.room}</p>}
              </div>
            </div>
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Course description..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
              {course ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Course Detail Modal Component
const CourseDetailModal = ({ isOpen, onClose, course, students }) => {
  if (!isOpen || !course) return null

  const enrolledStudents = students.filter(student => 
    student.enrolledCourses && student.enrolledCourses.includes(course.id)
  )

  const totalRevenue = course.enrolled * course.fee
  const occupancyRate = (course.enrolled / course.capacity * 100).toFixed(1)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                {course.code} - {course.name}
              </h2>
              <p className="text-surface-600 dark:text-surface-400 mt-1">
                {course.department} • {course.semester}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Course Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Users" className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Enrollment</span>
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {course.enrolled}/{course.capacity}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                {occupancyRate}% capacity
              </p>
            </div>

            <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="DollarSign" className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                ${course.fee} per student
              </p>
            </div>

            <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="BookOpen" className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Credits</span>
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {course.credits}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Credit hours
              </p>
            </div>

            <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="MapPin" className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Location</span>
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {course.schedule.room}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Classroom
              </p>
            </div>
          </div>

          {/* Schedule and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Details */}
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Course Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ApperIcon name="User" className="w-5 h-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">Instructor</p>
                    <p className="text-surface-600 dark:text-surface-400">{course.faculty}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ApperIcon name="Calendar" className="w-5 h-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">Schedule</p>
                    <p className="text-surface-600 dark:text-surface-400">
                      {course.schedule.days.join(', ')}
                    </p>
                    <p className="text-surface-600 dark:text-surface-400">
                      {course.schedule.startTime} - {course.schedule.endTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ApperIcon name="FileText" className="w-5 h-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">Description</p>
                    <p className="text-surface-600 dark:text-surface-400">
                      {course.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Students */}
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Enrolled Students ({enrolledStudents.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {enrolledStudents.length > 0 ? (
                  enrolledStudents.map(student => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-surface-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-surface-600 dark:text-surface-400 text-center py-8">
                    No students enrolled yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Courses