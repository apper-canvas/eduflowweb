import React from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const features = [
    {
      icon: "Users",
      title: "Student Management",
      description: "Comprehensive enrollment and academic record tracking",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "Calendar",
      title: "Course Scheduling",
      description: "Smart scheduling with conflict detection and room management",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "BookOpen",
      title: "Faculty Management",
      description: "Track assignments, performance metrics, and qualifications",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "BarChart3",
      title: "Analytics Dashboard",
      description: "Real-time insights and comprehensive reporting tools",
      color: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { label: "Active Students", value: "2,847", icon: "Users" },
    { label: "Faculty Members", value: "156", icon: "UserCheck" },
    { label: "Courses Offered", value: "342", icon: "BookOpen" },
    { label: "Departments", value: "12", icon: "Building2" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-20 pb-12 sm:pb-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-surface-900 dark:text-white">Modernize Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    College Administration
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-xl">
                  Streamline operations, reduce paperwork, and empower your institution with intelligent administrative tools designed for the digital age.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ApperIcon name="Rocket" className="w-5 h-5" />
                    Get Started
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-surface-800 text-surface-900 dark:text-white rounded-2xl font-semibold border-2 border-surface-200 dark:border-surface-600 hover:border-primary dark:hover:border-primary transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ApperIcon name="Play" className="w-5 h-5" />
                    Watch Demo
                  </span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white dark:bg-surface-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="College Campus"
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl"
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <ApperIcon name="Award" className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl transform rotate-6"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Comprehensive Management Tools
            </h3>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
              Everything you need to run a modern educational institution efficiently and effectively.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-6 sm:p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 border border-surface-100 dark:border-surface-700 hover:border-primary/30">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <ApperIcon name={feature.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Quick Student Enrollment
            </h3>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Experience our streamlined enrollment process designed to reduce administrative burden and improve student experience.
            </p>
          </motion.div>
          
          <MainFeature />
        </div>
      </section>
    </div>
  )
}

export default Home