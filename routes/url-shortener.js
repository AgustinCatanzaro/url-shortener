const express = require('express')
const router = express.Router()

const { urlShortener, getShortUrl } = require('../controllers/url-shortener')

router.route('/').post(urlShortener)
router.route('/:short_url').get(getShortUrl)

module.exports = router
