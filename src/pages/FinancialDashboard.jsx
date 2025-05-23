import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import ApperIcon from '../components/ApperIcon'

const FinancialDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    outstandingBalance: 0,
    totalCollected: 0,
    totalStudents: 0,
    recentTransactions: [],
    monthlyRevenue: [],
    paymentMethods: [],
    departmentRevenue: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    loadDashboardData()
  }, [timeRange])

  const loadDashboardData = () => {
    setLoading(true)
    try {
      // Load data from localStorage
      const payments = JSON.parse(localStorage.getItem('payments') || '[]')
      const fees = JSON.parse(localStorage.getItem('fees') || '[]')
      const students = JSON.parse(localStorage.getItem('students') || '[]')

      // Calculate metrics
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
      const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
      const outstandingBalance = totalFees - totalRevenue
      
      // Generate monthly revenue data
      const monthlyRevenue = generateMonthlyRevenue(payments, timeRange)
      
      // Payment methods breakdown
      const paymentMethods = generatePaymentMethodsData(payments)
      
      // Department revenue
      const departmentRevenue = generateDepartmentRevenue(fees)
      
      // Recent transactions
      const recentTransactions = payments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)

      setDashboardData({
        totalRevenue,
        outstandingBalance,
        totalCollected: totalRevenue,
        totalStudents: students.length,
        recentTransactions,
        monthlyRevenue,
        paymentMethods,
        departmentRevenue
      })

      toast.success('Dashboard data loaded successfully')
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyRevenue = (payments, range) => {
    const months = range === '6months' ? 6 : range === '12months' ? 12 : 3
    const data = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.date)
        return paymentDate.getMonth() === month.getMonth() && 
               paymentDate.getFullYear() === month.getFullYear()
      })
      
      data.push({
        month: month.toLocaleString('default', { month: 'short', year: '2-digit' }),
        revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        transactions: monthPayments.length
      })
    }
    
    return data
  }

  const generatePaymentMethodsData = (payments) => {
    const methods = {}
    payments.forEach(payment => {
      methods[payment.method] = (methods[payment.method] || 0) + payment.amount
    })
    
    return Object.entries(methods).map(([method, amount]) => ({
      method,
      amount,
      percentage: (amount / payments.reduce((sum, p) => sum + p.amount, 0) * 100).toFixed(1)
    }))
  }

  const generateDepartmentRevenue = (fees) => {
    const departments = {}
    fees.forEach(fee => {
      departments[fee.department] = (departments[fee.department] || 0) + fee.amount
    })
    
    return Object.entries(departments).map(([department, amount]) => ({
      department,
      amount
    }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const COLORS = ['#3B82F6', '#8B5CF6', '#06D6A0', '#F59E0B', '#EF4444', '#6366F1']

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
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Financial Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">Monitor your institution's financial performance</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-white"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Revenue</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{formatCurrency(dashboardData.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Outstanding Balance</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{formatCurrency(dashboardData.outstandingBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Collected</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{formatCurrency(dashboardData.totalCollected)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Students</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{dashboardData.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ method, percentage }) => `${method} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {dashboardData.paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Department Revenue & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Revenue by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.departmentRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {dashboardData.recentTransactions.length === 0 ? (
              <p className="text-surface-500 dark:text-surface-400 text-center py-8">No transactions found</p>
            ) : (
              dashboardData.recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">{transaction.studentName}</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{transaction.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(transaction.amount)}</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default FinancialDashboard