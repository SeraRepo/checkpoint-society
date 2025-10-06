require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sessionRoutes = require('./src/routes/sessions')
const bookingRoutes = require('./src/routes/bookings')
const authRoutes = require('./src/routes/auth')
const settingsRoutes = require('./src/routes/settings')
const { errorHandler } = require('./src/middleware/errorHandler')
const ApiResponse = require('./src/utils/ApiResponse')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// API Routes
app.use('/api/sessions', sessionRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/settings', settingsRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  ApiResponse.success(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// 404 handler for undefined routes
app.use((req, res) => {
  ApiResponse.notFound(res, `Route ${req.method} ${req.path} not found`)
})

// Global error handling middleware (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
