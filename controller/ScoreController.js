
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
				sendResponse({ res, data: { ranking: results } })
			})
			.catch((err) => {
				console.error(`getRankingForAllUsers: ${err}`)

				sendResponseError({ res, error: exp.message })
			})
	}

	// return top scores + user score - if user score is at top - it would be just top scores
	async getRankingForScore (req, res) {
		try {
			const userScore = checkGetParam(req, 'score')

			await this.handleUserScore({ req, res, userScore })

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
			const userScore = checkPostParam(req, 'score')

			await ScoreRepo.addScore({ user, score: userScore })

			await this.handleUserScore({ req, res, userScore })

		} catch (exp) {
			sendResponseError({ res, error: exp.message })
		}
	}



	//
	//
	//

	async handleUserScore ({ req, res, userScore }) {
		const score = await ScoreRepo.userScore(userScore)
		const ranking = await ScoreRepo.topScores()

		// add user's score if it's not in top
		if (score.ranking > ranking.length) {
			ranking.push(score)
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
		throw new Error(param)
	}

	return req.query[param]
}

//

function checkPostParam (req, param) {
	if (!req.body[param]) {
		throw new Error(param)
	}

	return req.body[param]
}


//
