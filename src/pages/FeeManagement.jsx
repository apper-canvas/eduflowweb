import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const FeeManagement = () => {
  const [fees, setFees] = useState([])
  const [filteredFees, setFilteredFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFee, setEditingFee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterType, setFilterType] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    amount: '',
    department: '',
    description: '',
    dueDate: '',
    isRecurring: false,
    recurringPeriod: 'monthly'
  })

  const feeTypes = ['Tuition', 'Lab Fee', 'Library Fee', 'Registration', 'Examination', 'Hostel', 'Transport', 'Other']
  const departments = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Medical', 'Law']
  const recurringPeriods = ['monthly', 'quarterly', 'semester', 'annual']

  useEffect(() => {
    loadFees()
  }, [])

  useEffect(() => {
    filterAndSortFees()
  }, [fees, searchTerm, filterDepartment, filterType, sortBy, sortOrder])

  const loadFees = () => {
    setLoading(true)
    try {
      const savedFees = JSON.parse(localStorage.getItem('fees') || '[]')
      setFees(savedFees)
      toast.success('Fees loaded successfully')
    } catch (error) {
      toast.error('Failed to load fees')
      console.error('Fee loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveFees = (updatedFees) => {
    try {
      localStorage.setItem('fees', JSON.stringify(updatedFees))
      setFees(updatedFees)
    } catch (error) {
      toast.error('Failed to save fees')
      console.error('Fee saving error:', error)
    }
  }

  const filterAndSortFees = () => {
    let filtered = [...fees]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(fee =>
        fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply department filter
    if (filterDepartment) {
      filtered = filtered.filter(fee => fee.department === filterDepartment)
    }

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(fee => fee.type === filterType)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'amount') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredFees(filtered)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.type || !formData.amount || !formData.department) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Fee amount must be greater than 0')
      return
    }

    const feeData = {
      ...formData,
      id: editingFee ? editingFee.id : Date.now().toString(),
      amount: parseFloat(formData.amount),
      createdAt: editingFee ? editingFee.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    let updatedFees
    if (editingFee) {
      updatedFees = fees.map(fee => fee.id === editingFee.id ? feeData : fee)
      toast.success('Fee updated successfully')
    } else {
      updatedFees = [...fees, feeData]
      toast.success('Fee created successfully')
    }

    saveFees(updatedFees)
    resetForm()
    setShowModal(false)
  }

  const handleEdit = (fee) => {
    setEditingFee(fee)
    setFormData({
      name: fee.name,
      type: fee.type,
      amount: fee.amount.toString(),
      department: fee.department,
      description: fee.description,
      dueDate: fee.dueDate,
      isRecurring: fee.isRecurring,
      recurringPeriod: fee.recurringPeriod
    })
    setShowModal(true)
  }

  const handleDelete = (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      const updatedFees = fees.filter(fee => fee.id !== feeId)
      saveFees(updatedFees)
      toast.success('Fee deleted successfully')
    }
  }

  const handleDuplicate = (fee) => {
    const duplicatedFee = {
      ...fee,
      id: Date.now().toString(),
      name: `${fee.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedFees = [...fees, duplicatedFee]
    saveFees(updatedFees)
    toast.success('Fee duplicated successfully')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      amount: '',
      department: '',
      description: '',
      dueDate: '',
      isRecurring: false,
      recurringPeriod: 'monthly'
    })
    setEditingFee(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const exportFees = () => {
    try {
      const dataStr = JSON.stringify(filteredFees, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fees_export_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('Fees exported successfully')
    } catch (error) {
      toast.error('Failed to export fees')
      console.error('Export error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Fee Management</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">Manage institutional fees and charges</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={exportFees}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Fee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Search</label>
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search fees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">All Types</option>
              {feeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="name">Name</option>
              <option value="amount">Amount</option>
              <option value="type">Type</option>
              <option value="department">Department</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee List */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 dark:bg-surface-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Recurring</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-surface-500 dark:text-surface-400">
                    {fees.length === 0 ? 'No fees found. Create your first fee to get started.' : 'No fees match your current filters.'}
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee, index) => (
                  <motion.tr
                    key={fee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-surface-900 dark:text-white">{fee.name}</div>
                        <div className="text-sm text-surface-500 dark:text-surface-400">{fee.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {fee.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-white">
                      {formatCurrency(fee.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                      {fee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                      {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'No due date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fee.isRecurring ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {fee.recurringPeriod}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                          One-time
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(fee)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(fee)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <ApperIcon name="Copy" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fee.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                  {editingFee ? 'Edit Fee' : 'Add New Fee'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Fee Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Fee Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      required
                    >
                      <option value="">Select type...</option>
                      {feeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      required
                    >
                      <option value="">Select department...</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleInputChange}
                        className="rounded border-surface-300 dark:border-surface-600"
                      />
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Recurring Fee</span>
                    </label>
                    
                    {formData.isRecurring && (
                      <select
                        name="recurringPeriod"
                        value={formData.recurringPeriod}
                        onChange={handleInputChange}
                        className="w-full mt-2 px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      >
                        {recurringPeriods.map(period => (
                          <option key={period} value={period}>{period.charAt(0).toUpperCase() + period.slice(1)}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-surface-700 dark:text-surface-300 border border-surface-300 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingFee ? 'Update Fee' : 'Create Fee'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FeeManagement