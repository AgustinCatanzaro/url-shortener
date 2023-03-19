const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
	url: {
		type: String,
		required: [true, 'url must be provided'],
	},
	shortref: {
		type: Number,
		required: [true, 'error generating short reference'],
	},
})

module.exports = mongoose.model('Urls', urlSchema)
