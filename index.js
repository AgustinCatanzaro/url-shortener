require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//init
app.use(express.json())
app.use(cors())
app.use('/public', express.static(`${process.cwd()}/public`))

//routers
const urlShortenerRouter = require('./routes/url-shortener')

//routes
app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html')
})

// Your first API endpoint
app.get('/api/hello', function (req, res) {
	res.json({ greeting: 'hello API' })
})

app.use('/api/shorturl', urlShortenerRouter)

//error handlers
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.listen(port, function () {
	console.log(`Listening on port ${port}`)
})
