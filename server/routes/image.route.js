const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const imageController = require('../controllers/image.controller')
const multer = require('multer')

const upload = multer({dest: 'temp/'})

// router.use(auth)
router.post('/upload', upload.array('images', 10), imageController.upload)
router.post('/delete', upload.array('images', 10), imageController.delete)

module.exports = router 