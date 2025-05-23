import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import ApperIcon from '../components/ApperIcon'

const FinancialReports = () => {
  const [reportData, setReportData] = useState({
    summary: {},
    chartData: [],
    tableData: []
  })
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    reportType: 'revenue',
    dateRange: 'last6months',
    startDate: '',
    endDate: '',
    department: '',
    paymentMethod: '',
    breakdown: 'monthly'
  })

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Report' },
    { value: 'payments', label: 'Payment Analysis' },
    { value: 'outstanding', label: 'Outstanding Balances' },
    { value: 'department', label: 'Department Breakdown' },
    { value: 'student', label: 'Student Financial Summary' }
  ]

  const dateRanges = [
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last12months', label: 'Last 12 Months' },
    { value: 'thisyear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const breakdowns = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ]

  const departments = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Medical', 'Law']
  const paymentMethods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'Online Payment', 'Mobile Payment']

  useEffect(() => {
    generateReport()
  }, [filters])

  const generateReport = () => {
    setLoading(true)
    try {
      const payments = JSON.parse(localStorage.getItem('payments') || '[]')
      const fees = JSON.parse(localStorage.getItem('fees') || '[]')
      const students = JSON.parse(localStorage.getItem('students') || '[]')

      let filteredPayments = [...payments]
      
      // Apply date filtering
      const dateFilter = getDateRange()
      if (dateFilter.start && dateFilter.end) {
        filteredPayments = filteredPayments.filter(payment => {
          const paymentDate = new Date(payment.date)
          return paymentDate >= dateFilter.start && paymentDate <= dateFilter.end
        })
      }

      // Apply department filtering
      if (filters.department) {
        filteredPayments = filteredPayments.filter(payment => {
          const studentDept = students.find(s => s.id === payment.studentId)?.department
          return studentDept === filters.department
        })
      }

      // Apply payment method filtering
      if (filters.paymentMethod) {
        filteredPayments = filteredPayments.filter(payment => payment.method === filters.paymentMethod)
      }

      const reportData = generateReportData(filteredPayments, fees, students)
      setReportData(reportData)
      toast.success('Report generated successfully')
    } catch (error) {
      toast.error('Failed to generate report')
      console.error('Report generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = () => {
    const now = new Date()
    let start, end

    switch (filters.dateRange) {
      case 'last3months':
        start = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        end = now
        break
      case 'last6months':
        start = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        end = now
        break
      case 'last12months':
        start = new Date(now.getFullYear(), now.getMonth() - 12, 1)
        end = now
        break
      case 'thisyear':
        start = new Date(now.getFullYear(), 0, 1)
        end = now
        break
      case 'custom':
        start = filters.startDate ? new Date(filters.startDate) : null
        end = filters.endDate ? new Date(filters.endDate) : null
        break
      default:
        start = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        end = now
    }

    return { start, end }
  }

  const generateReportData = (payments, fees, students) => {
    switch (filters.reportType) {
      case 'revenue':
        return generateRevenueReport(payments)
      case 'payments':
        return generatePaymentAnalysis(payments)
      case 'outstanding':
        return generateOutstandingReport(payments, fees, students)
      case 'department':
        return generateDepartmentReport(payments, students)
      case 'student':
        return generateStudentReport(payments, students)
      default:
        return { summary: {}, chartData: [], tableData: [] }
    }
  }

  const generateRevenueReport = (payments) => {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    const completedPayments = payments.filter(p => p.status === 'Completed')
    const completedRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)
    
    // Generate time series data
    const chartData = generateTimeSeriesData(payments, filters.breakdown)
    
    // Generate table data
    const tableData = payments.map(payment => ({
      date: new Date(payment.date).toLocaleDateString(),
      student: payment.studentName,
      amount: payment.amount,
      method: payment.method,
      status: payment.status
    }))

    return {
      summary: {
        totalRevenue,
        completedRevenue,
        pendingRevenue: totalRevenue - completedRevenue,
        totalTransactions: payments.length,
        averageTransaction: payments.length > 0 ? totalRevenue / payments.length : 0
      },
      chartData,
      tableData
    }
  }

  const generatePaymentAnalysis = (payments) => {
    const methodBreakdown = {}
    const statusBreakdown = {}
    
    payments.forEach(payment => {
      methodBreakdown[payment.method] = (methodBreakdown[payment.method] || 0) + payment.amount
      statusBreakdown[payment.status] = (statusBreakdown[payment.status] || 0) + payment.amount
    })

    const chartData = Object.entries(methodBreakdown).map(([method, amount]) => ({
      method,
      amount,
      count: payments.filter(p => p.method === method).length
    }))

    const tableData = payments.map(payment => ({
      date: new Date(payment.date).toLocaleDateString(),
      student: payment.studentName,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId
    }))

    return {
      summary: {
        totalMethods: Object.keys(methodBreakdown).length,
        mostUsedMethod: Object.entries(methodBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
        completedPayments: payments.filter(p => p.status === 'Completed').length,
        pendingPayments: payments.filter(p => p.status === 'Pending').length
      },
      chartData,
      tableData
    }
  }

  const generateOutstandingReport = (payments, fees, students) => {
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const outstanding = totalFees - totalPaid

    const studentOutstanding = students.map(student => {
      const studentPayments = payments.filter(p => p.studentId === student.id)
      const studentFees = fees.filter(f => f.department === student.department)
      const totalStudentFees = studentFees.reduce((sum, fee) => sum + fee.amount, 0)
      const totalStudentPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0)
      
      return {
        studentName: student.name,
        department: student.department,
        totalFees: totalStudentFees,
        totalPaid: totalStudentPaid,
        outstanding: totalStudentFees - totalStudentPaid
      }
    }).filter(s => s.outstanding > 0)

    return {
      summary: {
        totalOutstanding: outstanding,
        studentsWithOutstanding: studentOutstanding.length,
        averageOutstanding: studentOutstanding.length > 0 ? outstanding / studentOutstanding.length : 0,
        largestOutstanding: Math.max(...studentOutstanding.map(s => s.outstanding), 0)
      },
      chartData: studentOutstanding.slice(0, 10),
      tableData: studentOutstanding
    }
  }

  const generateDepartmentReport = (payments, students) => {
    const departmentData = {}
    
    payments.forEach(payment => {
      const student = students.find(s => s.id === payment.studentId)
      const dept = student?.department || 'Unknown'
      
      if (!departmentData[dept]) {
        departmentData[dept] = { revenue: 0, transactions: 0, students: new Set() }
      }
      
      departmentData[dept].revenue += payment.amount
      departmentData[dept].transactions += 1
      if (student) departmentData[dept].students.add(student.id)
    })

    const chartData = Object.entries(departmentData).map(([department, data]) => ({
      department,
      revenue: data.revenue,
      transactions: data.transactions,
      students: data.students.size
    }))

    const tableData = chartData.map(item => ({
      department: item.department,
      revenue: item.revenue,
      transactions: item.transactions,
      students: item.students,
      averagePerStudent: item.students > 0 ? item.revenue / item.students : 0
    }))

    return {
      summary: {
        totalDepartments: Object.keys(departmentData).length,
        topDepartment: chartData.sort((a, b) => b.revenue - a.revenue)[0]?.department || 'N/A',
        totalRevenue: Object.values(departmentData).reduce((sum, d) => sum + d.revenue, 0),
        totalTransactions: Object.values(departmentData).reduce((sum, d) => sum + d.transactions, 0)
      },
      chartData,
      tableData
    }
  }

  const generateStudentReport = (payments, students) => {
    const studentData = students.map(student => {
      const studentPayments = payments.filter(p => p.studentId === student.id)
      const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0)
      
      return {
        studentName: student.name,
        department: student.department,
        totalPaid,
        transactionCount: studentPayments.length,
        lastPayment: studentPayments.length > 0 ? 
          Math.max(...studentPayments.map(p => new Date(p.date).getTime())) : null
      }
    }).filter(s => s.totalPaid > 0)

    return {
      summary: {
        totalStudents: studentData.length,
        totalRevenue: studentData.reduce((sum, s) => sum + s.totalPaid, 0),
        averagePerStudent: studentData.length > 0 ? 
          studentData.reduce((sum, s) => sum + s.totalPaid, 0) / studentData.length : 0,
        topPayingStudent: studentData.sort((a, b) => b.totalPaid - a.totalPaid)[0]?.studentName || 'N/A'
      },
      chartData: studentData.slice(0, 10),
      tableData: studentData
    }
  }

  const generateTimeSeriesData = (payments, breakdown) => {
    const data = {}
    
    payments.forEach(payment => {
      const date = new Date(payment.date)
      let key
      
      switch (breakdown) {
        case 'daily':
          key = date.toISOString().split('T')[0]
          break
        case 'weekly':
          const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()))
          key = startOfWeek.toISOString().split('T')[0]
          break
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
        case 'quarterly':
          const quarter = Math.floor(date.getMonth() / 3) + 1
          key = `${date.getFullYear()}-Q${quarter}`
          break
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }
      
      if (!data[key]) {
        data[key] = { revenue: 0, transactions: 0 }
      }
      
      data[key].revenue += payment.amount
      data[key].transactions += 1
    })

    return Object.entries(data).map(([period, values]) => ({
      period,
      ...values
    })).sort((a, b) => a.period.localeCompare(b.period))
  }

  const exportReport = () => {
    try {
      const exportData = {
        reportType: filters.reportType,
        generatedAt: new Date().toISOString(),
        filters,
        summary: reportData.summary,
        data: reportData.tableData
      }
      
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `financial_report_${filters.reportType}_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
      
      toast.success('Report exported successfully')
    } catch (error) {
      toast.error('Failed to export report')
      console.error('Export error:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const COLORS = ['#3B82F6', '#8B5CF6', '#06D6A0', '#F59E0B', '#EF4444', '#6366F1']

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
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Financial Reports</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">Generate comprehensive financial reports and analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <ApperIcon name="RefreshCw" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700 mb-8">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Report Type</label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          
          {filters.dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">All Methods</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Breakdown</label>
            <select
              value={filters.breakdown}
              onChange={(e) => setFilters(prev => ({ ...prev, breakdown: e.target.value }))}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              {breakdowns.map(breakdown => (
                <option key={breakdown.value} value={breakdown.value}>{breakdown.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {Object.keys(reportData.summary).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(reportData.summary).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600 dark:text-surface-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    {typeof value === 'number' && key.toLowerCase().includes('revenue') || key.toLowerCase().includes('outstanding') || key.toLowerCase().includes('paid') || key.toLowerCase().includes('average') ?
                      formatCurrency(value) : value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chart */}
      {reportData.chartData.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-lg border border-surface-200 dark:border-surface-700 mb-8">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            {reportTypes.find(t => t.value === filters.reportType)?.label} Chart
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            {filters.reportType === 'revenue' ? (
              <LineChart data={reportData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            ) : filters.reportType === 'payments' ? (
              <BarChart data={reportData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#8B5CF6" />
              </BarChart>
            ) : (
              <BarChart data={reportData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={Object.keys(reportData.chartData[0])[0]} />
                <YAxis />
                <Tooltip formatter={(value) => typeof value === 'number' && value > 1000 ? formatCurrency(value) : value} />
                <Legend />
                <Bar dataKey={Object.keys(reportData.chartData[0])[1]} fill="#06D6A0" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Table */}
      {reportData.tableData.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Detailed Data</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-700">
                <tr>
                  {Object.keys(reportData.tableData[0]).map(key => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {reportData.tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                    {Object.entries(row).map(([key, value], cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                        {typeof value === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('outstanding') || key.toLowerCase().includes('paid') || key.toLowerCase().includes('average')) ?
                          formatCurrency(value) : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default FinancialReports