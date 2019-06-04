
const MongoClient = require('mongodb').MongoClient

const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URL = `mongodb://${DB_HOST}:27017/${DB_NAME}`


class DB {

	// connect to DB that does not exist will cause create new one
	connect () {
		return new Promise((resolve, reject)=>{
			MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, client) => {
  				if (err)  {
					reject(err)
					return
				}

				this.db = client.db(DB_NAME)

				resolve()
			})
		})
	}

	close () {
		if (this.db) {
			this.db.close(()=>{
				this.db = null
			})
		}
	}

	init () {
		this.mongoDb.createCollection("users", (err, res) => {
  			if (err) {
				console.error('DB ERROR = ', err);
			}

  			console.log('DB USERS CREATED')
		})
	}

	//

	clear () {
		console.log('[DB] CLEAR')
	}


	//

	get mongoDb () {
		return this.db
	}

}


module.exports = DB
