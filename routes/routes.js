const express = require('express')
const router = express.Router()
const {test} = require('../controllers/controllers')


router.get('/',test)
module.exports = router