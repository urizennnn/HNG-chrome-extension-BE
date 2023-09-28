const express = require('express')
const router = express.Router()
const {test,sendVideo,view} = require('../controllers/controllers')


router.get('/',test)
router.post('/uploadfile',sendVideo)
router.get('/showvideos',view)
module.exports = router