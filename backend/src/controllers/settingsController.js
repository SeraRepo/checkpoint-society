const Settings = require('../models/Settings')
const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')
const { asyncHandler } = require('../middleware/errorHandler')

/**
 * @route GET /api/settings
 * @desc Get all settings
 * @access Public
 */
exports.getAllSettings = asyncHandler(async (req, res) => {
  const settings = Settings.getAll()

  // Convert array to object for easier access
  const settingsObj = {}
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value
  })

  return ApiResponse.success(res, settingsObj)
})

/**
 * @route GET /api/settings/:key
 * @desc Get setting by key
 * @access Public
 */
exports.getSetting = asyncHandler(async (req, res) => {
  const { key } = req.params
  const value = Settings.get(key)

  if (value === null) {
    throw ApiError.notFound('Setting not found')
  }

  return ApiResponse.success(res, { key, value })
})

/**
 * @route PUT /api/settings/:key
 * @desc Update setting
 * @access Private (Admin)
 */
exports.updateSetting = asyncHandler(async (req, res) => {
  const { key } = req.params
  const { value } = req.body

  if (value === undefined || value === null) {
    throw ApiError.badRequest('Value is required')
  }

  const updated = Settings.set(key, value)

  if (!updated) {
    throw ApiError.serverError('Failed to update setting')
  }

  return ApiResponse.success(res, { key, value }, 'Setting updated successfully')
})
