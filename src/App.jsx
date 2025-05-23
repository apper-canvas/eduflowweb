import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import FinancialDashboard from './pages/FinancialDashboard'
import FeeManagement from './pages/FeeManagement'
import PaymentProcessing from './pages/PaymentProcessing'
import FinancialReports from './pages/FinancialReports'
import Students from './pages/Students'
import ApperIcon from './components/ApperIcon'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-surface-50 via-blue-50/30 to-purple-50/20 dark:from-surface-900 dark:via-surface-800 dark:to-purple-900/20 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-surface-800/80 border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <ApperIcon name="GraduationCap" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    EduFlow
                  </h1>
                  <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                    College Administration Hub
                  </p>
                </div>
              </motion.div>
              
              <nav className="hidden lg:flex items-center space-x-8">
                <a href="/" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary transition-colors">
                  Home
                </a>
                <div className="relative group">
                  <button className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary transition-colors flex items-center gap-1">
                    Financial
                    <ApperIcon name="ChevronDown" className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <a href="/financial/dashboard" className="block px-4 py-3 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-t-xl">Dashboard</a>
                    <a href="/financial/fees" className="block px-4 py-3 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700">Fee Management</a>
                    <a href="/financial/payments" className="block px-4 py-3 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700">Payments</a>
                    <a href="/financial/reports" className="block px-4 py-3 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-b-xl">Reports</a>
                  </div>
                </div>
                <a href="/students" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary transition-colors">
                  Students
                </a>
                <a href="/courses" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary transition-colors">
                  Courses
                </a>
              </nav>
              
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 transition-all duration-200 shadow-neu-light dark:shadow-neu-dark"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 text-surface-600 dark:text-surface-300" 
                />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/financial/dashboard" element={<FinancialDashboard />} />
              <Route path="/financial/fees" element={<FeeManagement />} />
              <Route path="/financial/payments" element={<PaymentProcessing />} />
              <Route path="/financial/reports" element={<FinancialReports />} />
              <Route path="/students" element={<Students />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-20 border-t border-surface-200 dark:border-surface-700 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-surface-600 dark:text-surface-400">
              <p className="text-sm">© 2024 EduFlow. Streamlining college administration with modern technology.</p>
            </div>
          </div>
        </footer>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16"
        toastClassName="backdrop-blur-md"
      />
    </div>
  )
}

export default App