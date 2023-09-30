const express = require('express')
const router = express.Router()
const {test,sendVideo,getVideos,transcribe} = require('../controllers/controllers')


router.get('/',test)
router.post('/uploadfile',sendVideo)
router.route('/showvideos').get(getVideos)
router.get('/transcribe/:filename',transcribe)
module.exports = router