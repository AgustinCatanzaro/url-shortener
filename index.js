require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express()

// connectDB
const connectDB = require('./db/connect')

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//init

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use('/public', express.static(`${process.cwd()}/public`))

//routers
const urlShortenerRouter = require('./routes/url-shortener')

//routes
app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html')
})

app.use('/api/shorturl', urlShortenerRouter)

//error handlers
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Basic Configuration
const port = process.env.PORT || 3000

//added db connection
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		)
	} catch (error) {
		console.log(error)
	}
}

start()
