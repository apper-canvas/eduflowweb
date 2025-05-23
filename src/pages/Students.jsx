import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Students = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)

  // Load students from localStorage on component mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('students')
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents)
      setStudents(parsedStudents)
      setFilteredStudents(parsedStudents)
    } else {
      // Initialize with sample data
      const sampleStudents = [
        {
          id: 1,
          studentId: 'STU001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@university.edu',
          phone: '+1-555-0123',
          dateOfBirth: '1999-03-15',
          address: '123 University Ave, College Town, CT 06520',
          department: 'Computer Science',
          year: 'Sophomore',
          gpa: 3.7,
          enrollmentDate: '2022-09-01',
          status: 'Active',
          financialStatus: 'Paid',
          guardianName: 'Jane Doe',
          guardianPhone: '+1-555-0124',
          emergencyContact: 'Mike Doe - +1-555-0125'
        },
        {
          id: 2,
          studentId: 'STU002',
          firstName: 'Emily',
          lastName: 'Johnson',
          email: 'emily.johnson@university.edu',
          phone: '+1-555-0126',
          dateOfBirth: '2000-07-22',
          address: '456 Campus Rd, College Town, CT 06520',
          department: 'Business Administration',
          year: 'Junior',
          gpa: 3.9,
          enrollmentDate: '2021-09-01',
          status: 'Active',
          financialStatus: 'Pending',
          guardianName: 'Robert Johnson',
          guardianPhone: '+1-555-0127',
          emergencyContact: 'Sarah Johnson - +1-555-0128'
        },
        {
          id: 3,
          studentId: 'STU003',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@university.edu',
          phone: '+1-555-0129',
          dateOfBirth: '1998-11-08',
          address: '789 Student St, College Town, CT 06520',
          department: 'Engineering',
          year: 'Senior',
          gpa: 3.5,
          enrollmentDate: '2020-09-01',
          status: 'Active',
          financialStatus: 'Overdue',
          guardianName: 'Linda Brown',
          guardianPhone: '+1-555-0130',
          emergencyContact: 'David Brown - +1-555-0131'
        }
      ]
      setStudents(sampleStudents)
      setFilteredStudents(sampleStudents)
      localStorage.setItem('students', JSON.stringify(sampleStudents))
    }
  }, [])

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students.filter(student => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || student.status.toLowerCase() === filterStatus
      const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment
      
      return matchesSearch && matchesStatus && matchesDepartment
    })
    
    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, filterStatus, filterDepartment, students])

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const departments = ['Computer Science', 'Business Administration', 'Engineering', 'Liberal Arts', 'Sciences']
  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior']
  const statuses = ['Active', 'Inactive', 'Graduated', 'Suspended']

  const handleAddStudent = (formData) => {
    setLoading(true)
    setTimeout(() => {
      const newStudent = {
        id: Date.now(),
        studentId: `STU${String(students.length + 1).padStart(3, '0')}`,
        ...formData
      }
      const updatedStudents = [...students, newStudent]
      setStudents(updatedStudents)
      localStorage.setItem('students', JSON.stringify(updatedStudents))
      setShowAddModal(false)
      setLoading(false)
      toast.success('Student added successfully!')
    }, 1000)
  }

  const handleEditStudent = (formData) => {
    setLoading(true)
    setTimeout(() => {
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id ? { ...student, ...formData } : student
      )
      setStudents(updatedStudents)
      localStorage.setItem('students', JSON.stringify(updatedStudents))
      setShowEditModal(false)
      setSelectedStudent(null)
      setLoading(false)
      toast.success('Student updated successfully!')
    }, 1000)
  }

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      const updatedStudents = students.filter(student => student.id !== studentId)
      setStudents(updatedStudents)
      localStorage.setItem('students', JSON.stringify(updatedStudents))
      toast.success('Student deleted successfully!')
    }
  }

  const handleViewStudent = (student) => {
    setSelectedStudent(student)
    setShowViewModal(true)
  }

  const handleEditClick = (student) => {
    setSelectedStudent(student)
    setShowEditModal(true)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800 border-green-200',
      Inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      Graduated: 'bg-blue-100 text-blue-800 border-blue-200',
      Suspended: 'bg-red-100 text-red-800 border-red-200'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status] || statusClasses.Active}`}>
        {status}
      </span>
    )
  }

  const getFinancialStatusBadge = (status) => {
    const statusClasses = {
      Paid: 'payment-status-paid',
      Pending: 'payment-status-pending',
      Overdue: 'payment-status-overdue'
    }
    return (
      <span className={statusClasses[status] || statusClasses.Pending}>
        {status}
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          className="text-3xl font-bold text-surface-900 dark:text-white mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Student Management
        </motion.h1>
        <motion.p 
          className="text-surface-600 dark:text-surface-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Manage student records, enrollment, and academic information
        </motion.p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="financial-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="financial-label">Total Students</p>
              <p className="financial-metric">{students.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="financial-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="financial-label">Active Students</p>
              <p className="financial-metric">{students.filter(s => s.status === 'Active').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="UserCheck" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="financial-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="financial-label">Departments</p>
              <p className="financial-metric">{departments.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="Building2" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="financial-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="financial-label">Average GPA</p>
              <p className="financial-metric">
                {students.length > 0 ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div 
        className="financial-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            Add Student
          </motion.button>
        </div>
      </motion.div>

      {/* Students Table */}
      <motion.div 
        className="financial-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="overflow-x-auto">
          <table className="financial-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Financial</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <td className="font-medium">{student.studentId}</td>
                  <td>
                    <div>
                      <div className="font-medium">{student.firstName} {student.lastName}</div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">{student.email}</div>
                    </div>
                  </td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>
                    <span className={`font-medium ${student.gpa >= 3.5 ? 'text-green-600' : student.gpa >= 3.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {student.gpa}
                    </span>
                  </td>
                  <td>{getStatusBadge(student.status)}</td>
                  <td>{getFinancialStatusBadge(student.financialStatus)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleViewStudent(student)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleEditClick(student)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 dark:border-surface-700">
            <div className="text-sm text-surface-600 dark:text-surface-400">
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-surface-300 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-surface-300 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <StudentFormModal
            title="Add New Student"
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddStudent}
            departments={departments}
            years={years}
            statuses={statuses}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {showEditModal && selectedStudent && (
          <StudentFormModal
            title="Edit Student"
            student={selectedStudent}
            onClose={() => { setShowEditModal(false); setSelectedStudent(null); }}
            onSubmit={handleEditStudent}
            departments={departments}
            years={years}
            statuses={statuses}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* View Student Modal */}
      <AnimatePresence>
        {showViewModal && selectedStudent && (
          <StudentViewModal
            student={selectedStudent}
            onClose={() => { setShowViewModal(false); setSelectedStudent(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Student Form Modal Component
const StudentFormModal = ({ title, student, onClose, onSubmit, departments, years, statuses, loading }) => {
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    phone: student?.phone || '',
    dateOfBirth: student?.dateOfBirth || '',
    address: student?.address || '',
    department: student?.department || '',
    year: student?.year || '',
    gpa: student?.gpa || '',
    enrollmentDate: student?.enrollmentDate || '',
    status: student?.status || 'Active',
    financialStatus: student?.financialStatus || 'Pending',
    guardianName: student?.guardianName || '',
    guardianPhone: student?.guardianPhone || '',
    emergencyContact: student?.emergencyContact || ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.gpa || formData.gpa < 0 || formData.gpa > 4) newErrors.gpa = 'GPA must be between 0 and 4'
    if (!formData.enrollmentDate) newErrors.enrollmentDate = 'Enrollment date is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6 text-surface-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.firstName ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.lastName ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.phone ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.dateOfBirth ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter address"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Academic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.department ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.year ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  GPA *
                </label>
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="4"
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.gpa ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter GPA (0.00 - 4.00)"
                />
                {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Enrollment Date *
                </label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.enrollmentDate ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                />
                {errors.enrollmentDate && <p className="text-red-500 text-sm mt-1">{errors.enrollmentDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Financial Status
                </label>
                <select
                  name="financialStatus"
                  value={formData.financialStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact Information */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Emergency Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter guardian name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter guardian phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-500 dark:placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Name - Phone"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-5 h-5" />
                  Save Student
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Student View Modal Component
const StudentViewModal = ({ student, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Student Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6 text-surface-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Student ID:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{student.studentId}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Full Name:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{student.firstName} {student.lastName}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Email:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{student.email}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Phone:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{student.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Date of Birth:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Address:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{student.address}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Academic Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Department:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{student.department}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Year:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{student.year}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">GPA:</span>
                  <p className={`font-medium ${student.gpa >= 3.5 ? 'text-green-600' : student.gpa >= 3.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {student.gpa}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Enrollment Date:</span>
                  <p className="font-medium text-surface-900 dark:text-white">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Status:</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                      student.status === 'Inactive' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                      student.status === 'Graduated' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Financial Status:</span>
                  <div className="mt-1">
                    <span className={
                      student.financialStatus === 'Paid' ? 'payment-status-paid' :
                      student.financialStatus === 'Pending' ? 'payment-status-pending' :
                      'payment-status-overdue'
                    }>
                      {student.financialStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Information */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Emergency Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-sm text-surface-600 dark:text-surface-400">Guardian Name:</span>
                <p className="font-medium text-surface-900 dark:text-white">{student.guardianName || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm text-surface-600 dark:text-surface-400">Guardian Phone:</span>
                <p className="font-medium text-surface-900 dark:text-white">{student.guardianPhone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm text-surface-600 dark:text-surface-400">Emergency Contact:</span>
                <p className="font-medium text-surface-900 dark:text-white">{student.emergencyContact || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Students