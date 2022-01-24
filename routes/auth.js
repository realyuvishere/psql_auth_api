const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')

const {
    login,
    register,
    update,
} = require('../controller/auth')

router.post('/login', login)
router.post('/register', register)

router.put('/update', auth, update)

module.exports = router