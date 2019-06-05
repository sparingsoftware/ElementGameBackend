
const ScoreRepo = require('../db/ScoreRepo')

//

module.exports = class ScoreController {

	constructor (db) {
		this.db = db

		ScoreRepo.setDB(db)
	}

	//
	// GET
	//

	defaultValue (req, res) {
		res.send(`ELEMENT GAME IS_DEV: ${process.env.DEV}`)
	}

	//

	// return top scores
	getRankingForAllUsers (req, res) {
		ScoreRepo.topScores()
			.then((results) => {
				const ranking = results.map((result, index) => { return { ...result, ranking: index+1 } })
				sendResponse({ res, data: { ranking } })
			})
			.catch((err) => {
				console.error(`getRankingForAllUsers: ${err}`)

				sendResponseError({ res, error: exp.message })
			})
	}

	// return top scores + user score - if user score is at top - it would be just top scores
	async getRankingForUser (req, res) {
		try {
			const user = checkGetParam(req, 'user')

			await this.handleUserScore({ req, res, user })

		} catch (exp) {
			sendResponseError({ res, error: exp.message})
		}
	}


	//
	// POST
	//

	// requires { user, score }
	// return success / false
	// if user does not exists - it will create new
	async addScore (req, res) {
		try {
			const user = checkPostParam(req, 'user')
			const userScore = parseInt(checkPostParam(req, 'score'))

			await ScoreRepo.addScore({ user, score: userScore })

			await this.handleUserScore({ req, res, user })

		} catch (exp) {
			sendResponseError({ res, error: exp.message })
		}
	}



	//
	//
	//

	async handleUserScore ({ req, res, user }) {
		const score = await ScoreRepo.userScore({ user }) // get user score
		const topScores = await ScoreRepo.topScores()

		const ranking = topScores.map((result, index) => { return { ...result, ranking: index+1 } })

		if (!score) { // no score for this user
			sendResponse({ res, data: { ranking } })
		}

		if (ranking.length == 0) {
			ranking.push(score)
		} else if (score.ranking >= ranking.length) {
			ranking[ranking.length - 1] = score
		}

		sendResponse({ res, data: { ranking } })
	}

}


//
// Helpers
//

function sendResponse({ res, data }) {
	res.setHeader('Content-Type', 'application/json')
	res.send(data)
}

function sendResponseError({ res, error }) {
	res.setHeader('Content-Type', 'application/json')
	res.status(400).send({ error })
}

//

function checkGetParam (req, param) {
	if (!req.query[param]) {
		throw new Error(`missing param: ${param}`)
	}

	return req.query[param]
}

//

function checkPostParam (req, param) {
	if (!req.body[param]) {
		throw new Error(`missing param: ${param}`)
	}

	return req.body[param]
}


//
