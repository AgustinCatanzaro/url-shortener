const UrlDB = require('../models/urls')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')

const urlShortener = async (req, res) => {
	// agregar lo de hostname si la url tiene el formato correcto pero no existe.

	const { url: requestedUrl } = req.body
	console.log(requestedUrl)

	//before accessing db need to check if the request url is a valid one.
	const checkUrl = new URL(requestedUrl)
	if (!checkUrl) {
		throw new BadRequestError('invalid url')
	}

	//checking if the url already exists in the db.
	let url = await UrlDB.findOne({
		url: requestedUrl,
	})
	//if the url already exists in the db, we send it back and its shor url reference.
	if (url) {
		const { url: orignalUrl, shortref: assignedRef } = url
		res.status(StatusCodes.OK).json({
			original_url: orignalUrl,
			short_url: assignedRef,
		})
	} //if the url doesnt exist, we get the greater shortref created in the db and create a new element with the new url and the last shortref+1
	else {
		url = await UrlDB.find().sort('-shortref').select('shortref').limit(1)
		const greatestShortref = url[0].shortref + 1
		await UrlDB.create({ url: requestedUrl, shortref: greatestShortref })
		console.log(
			`${requestedUrl} added to the db with the short url: ${greatestShortref}`
		)
		res.status(StatusCodes.OK).json({
			original_url: requestedUrl,
			short_url: greatestShortref,
		})
	}
}
//prob async
const getShortUrl = (req, res) => {
	res.send('getShortUrl controller')
}

module.exports = { urlShortener, getShortUrl }
