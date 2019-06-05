// setup env config
require('dotenv').config()


const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
const bodyParser = require("body-parser")
const DB = require('./db/db')
const Router = require('./router/Router')



//

const PORT = process.env.PORT

const db = new DB()
const router = new Router(app, db)

//

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// - - - - - - - - - - - - -

db.connect()
	.then(()=>{
		app.listen(PORT, () => {
			console.log(`Server is now running on port ${PORT}`)
		})

		router.start()
	})
	.catch((err)=>{
		console.error('DB CONNECT ERROR = ', err)
	})
