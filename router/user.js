const express = require('express')
const router = express.Router()
const userController = require('../controller/user')
const userValidator = require('../validator/user')
const auth = require('../middleware/auth')

router.post('/users/login', userValidator.login, userController.login)

router.post('/users',userValidator.register, userController.register) 

router.get('/users', auth, userController.getCurrentUser)

module.exports = router
