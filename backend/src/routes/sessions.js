const express = require('express')
const router = express.Router()
const sessionController = require('../controllers/sessionController')

router.get('/', sessionController.getAllSessions)
router.get('/:id', sessionController.getSessionById)
router.post('/', sessionController.createSession)
router.put('/:id', sessionController.updateSession)

module.exports = router
