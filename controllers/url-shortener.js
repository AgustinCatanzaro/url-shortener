const UrlDB = require('../models/urls')
const dns = require('dns')
const { StatusCodes } = require('http-status-codes')

const urlShortener = (req, res) => {
	const { url: requestedUrl } = req.body

	const parsedUrl = new URL(requestedUrl)

	//blocking the url if comes with params
	if (parsedUrl.search) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'invalid url' })
	}

	//before accessing db need to check if the request url is a valid one/exists.
	dns.lookup(parsedUrl.hostname, async (err) => {
		if (!err) {
			console.log(req.body.url)
			//checking if the url exists in the db
			const dbUrl = await UrlDB.findOne({
				url: req.body.url,
			})
			//if the url already exists in the db, we send it back and its short url reference.
			if (dbUrl) {
				const { url: originalUrl, shortref: assignedRef } = dbUrl
				res.status(StatusCodes.OK).json({
					original_url: originalUrl,
					short_url: assignedRef,
				})
			} else {
				//if the url doesnt exists we search the highest shortReference
				const dbMaxShortRef = await UrlDB.find()
					.sort('-shortref')
					.select('shortref')
					.limit(1)
				const greatestShortref = dbMaxShortRef[0].shortref + 1

				//we create a new entry in the db with the received url and the  HighestReference in the db +1
				await UrlDB.create({
					url: req.body.url,
					shortref: greatestShortref,
				})
				console.log(
					`${parsedUrl.origin} added to the db with the short url: ${greatestShortref}`
				)
				//we send a response with the url and the reference saved in the db
				res.status(StatusCodes.OK).json({
					original_url: req.body.url,
					short_url: greatestShortref,
				})
			}
		} else {
			//if the url is invalid/doesnt exists we send an error response.
			res.status(StatusCodes.BAD_REQUEST).json({ error: 'invalid url' })
		}
	})
}

const getShortUrl = async (req, res) => {
	const { short_url: receivedReference } = req.params
	const dbRef = await UrlDB.findOne({
		shortref: receivedReference,
	})
	//checking if the short url exists in the db and redirecting to it.
	if (dbRef) {
		const { url: urlRedirect } = dbRef
		res.redirect(urlRedirect)
	} else {
		// if the short url doesnt exist sending response with the error.
		res.status(StatusCodes.OK).json({
			error: 'No short URL found for the given input',
		})
	}
}

module.exports = { urlShortener, getShortUrl }
