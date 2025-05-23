import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const PaymentProcessing = () => {
  const [payments, setPayments] = useState([])
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterMethod, setFilterMethod] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    feeId: '',
    amount: '',
    method: '',
    transactionId: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  })

  const paymentMethods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'Online Payment', 'Mobile Payment']
  const paymentStatuses = ['Completed', 'Pending', 'Failed', 'Refunded']

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, filterStatus, filterMethod, dateRange])

  const loadData = () => {
    setLoading(true)
    try {
      const savedPayments = JSON.parse(localStorage.getItem('payments') || '[]')
      const savedStudents = JSON.parse(localStorage.getItem('students') || '[]')
      const savedFees = JSON.parse(localStorage.getItem('fees') || '[]')
      
      setPayments(savedPayments)
      setStudents(savedStudents)
      setFees(savedFees)
      
      toast.success('Payment data loaded successfully')
    } catch (error) {
      toast.error('Failed to load payment data')
      console.error('Payment loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePayments = (updatedPayments) => {
    try {
      localStorage.setItem('payments', JSON.stringify(updatedPayments))
      setPayments(updatedPayments)
    } catch (error) {
      toast.error('Failed to save payment data')
      console.error('Payment saving error:', error)
    }
  }

  const filterPayments = () => {
    let filtered = [...payments]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(payment => payment.status === filterStatus)
    }

    // Apply method filter
    if (filterMethod) {
      filtered = filtered.filter(payment => payment.method === filterMethod)
    }

    // Apply date range filter
    if (dateRange.start) {
      filtered = filtered.filter(payment => new Date(payment.date) >= new Date(dateRange.start))
    }
    if (dateRange.end) {
      filtered = filtered.filter(payment => new Date(payment.date) <= new Date(dateRange.end))
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

    setFilteredPayments(filtered)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-populate student name when student is selected
    if (name === 'studentId') {
      const selectedStudent = students.find(s => s.id === value)
      if (selectedStudent) {
        setFormData(prev => ({
          ...prev,
          studentName: selectedStudent.name
        }))
      }
    }

    // Auto-populate fee amount when fee is selected
    if (name === 'feeId') {
      const selectedFee = fees.find(f => f.id === value)
      if (selectedFee) {
        setFormData(prev => ({
          ...prev,
          amount: selectedFee.amount.toString()
        }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.studentId || !formData.amount || !formData.method) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Payment amount must be greater than 0')
      return
    }

    const paymentData = {
      ...formData,
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      status: 'Completed',
      transactionId: formData.transactionId || `TXN${Date.now()}`,
      createdAt: new Date().toISOString(),
      receiptNumber: `RCP${Date.now()}`
    }

    const updatedPayments = [...payments, paymentData]
    savePayments(updatedPayments)
    toast.success('Payment processed successfully')
    
    // Show receipt
    setSelectedReceipt(paymentData)
    setShowReceiptModal(true)
    
    resetForm()
    setShowModal(false)
  }

  const handleRefund = (paymentId) => {
    if (window.confirm('Are you sure you want to refund this payment?')) {
      const updatedPayments = payments.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: 'Refunded', refundedAt: new Date().toISOString() }
          : payment
      )
      savePayments(updatedPayments)
      toast.success('Payment refunded successfully')
    }
  }

  const handleDelete = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      const updatedPayments = payments.filter(payment => payment.id !== paymentId)
      savePayments(updatedPayments)
      toast.success('Payment record deleted successfully')
    }
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      feeId: '',
      amount: '',
      method: '',
      transactionId: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const generateReceipt = (payment) => {
    setSelectedReceipt(payment)
    setShowReceiptModal(true)
  }

  const downloadReceipt = () => {
    if (!selectedReceipt) return
    
    const receiptContent = `
      PAYMENT RECEIPT
      ================
      Receipt Number: ${selectedReceipt.receiptNumber}
      Date: ${new Date(selectedReceipt.date).toLocaleDateString()}
      
      Student: ${selectedReceipt.studentName}
      Amount: ${formatCurrency(selectedReceipt.amount)}
      Payment Method: ${selectedReceipt.method}
      Transaction ID: ${selectedReceipt.transactionId}
      Status: ${selectedReceipt.status}
      
      ${selectedReceipt.notes ? `Notes: ${selectedReceipt.notes}` : ''}
      
      Generated on: ${new Date().toLocaleString()}
    `
    
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt_${selectedReceipt.receiptNumber}.txt`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success('Receipt downloaded successfully')
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
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Payment Processing</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">Process student payments and manage transactions</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          Process Payment
        </button>
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
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              {paymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Method</label>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">All Methods</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 dark:bg-surface-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-surface-500 dark:text-surface-400">
                    {payments.length === 0 ? 'No payments found. Process your first payment to get started.' : 'No payments match your current filters.'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-900 dark:text-white">{payment.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        payment.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                      {payment.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => generateReceipt(payment)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <ApperIcon name="FileText" className="w-4 h-4" />
                        </button>
                        {payment.status === 'Completed' && (
                          <button
                            onClick={() => handleRefund(payment.id)}
                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          >
                            <ApperIcon name="RotateCcw" className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(payment.id)}
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

      {/* Payment Processing Modal */}
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
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Process Payment</h2>
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
                      Student *
                    </label>
                    <select
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      required
                    >
                      <option value="">Select student...</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Fee Type
                    </label>
                    <select
                      name="feeId"
                      value={formData.feeId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    >
                      <option value="">Select fee type...</option>
                      {fees.map(fee => (
                        <option key={fee.id} value={fee.id}>{fee.name} - {formatCurrency(fee.amount)}</option>
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
                      Payment Method *
                    </label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                      required
                    >
                      <option value="">Select method...</option>
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      placeholder="Auto-generated if empty"
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                    />
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
                    Process Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && selectedReceipt && (
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
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Payment Receipt</h2>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">EduFlow College</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400">Payment Receipt</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Receipt #:</span>
                    <span className="font-medium text-surface-900 dark:text-white">{selectedReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Date:</span>
                    <span className="font-medium text-surface-900 dark:text-white">{new Date(selectedReceipt.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Student:</span>
                    <span className="font-medium text-surface-900 dark:text-white">{selectedReceipt.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Amount:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(selectedReceipt.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Method:</span>
                    <span className="font-medium text-surface-900 dark:text-white">{selectedReceipt.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Transaction ID:</span>
                    <span className="font-medium text-surface-900 dark:text-white">{selectedReceipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Status:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{selectedReceipt.status}</span>
                  </div>
                  {selectedReceipt.notes && (
                    <div>
                      <span className="text-surface-600 dark:text-surface-400">Notes:</span>
                      <p className="font-medium text-surface-900 dark:text-white mt-1">{selectedReceipt.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-4 py-2 text-surface-700 dark:text-surface-300 border border-surface-300 dark:border-surface-600 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={downloadReceipt}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <ApperIcon name="Download" className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PaymentProcessing