require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

// routes
const auth = require('./routes/auth')

// functional variables
let port = process.env.PORT || 8080
const corsConfig = {
	origin: true,
	credentials: true
}

app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(express.json())
app.use(cors(corsConfig))

app.options('*', cors(corsConfig))
app.use('/auth', auth)

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})