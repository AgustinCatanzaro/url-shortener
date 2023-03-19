const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')

//prob async
const urlShortener = (req, res) => {
	res.send('urlShortener controller')
}
//prob async
const getShortUrl = (req, res) => {
	res.send('getShortUrl controller')
}

module.exports = { urlShortener, getShortUrl }
