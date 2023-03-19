const express = require('express')
const router = express.Router()

const { urlShortener, getShortUrl } = require('../controllers/url-shortener')

router.route('/').post(urlShortener)
router.route('/:shortref').get(getShortUrl)

module.exports = router
