
const ScoreController = require('../controller/ScoreController')


//


class Router {

	constructor (app, db) {
		this.app = app

		this.scoreController = new ScoreController(db)
	}

	start() {

		this.app.get('/', (...args) => this.scoreController.defaultValue(...args))

		//

		// GET /ranking_all
		this.app.get('/ranking_all', (...args) => this.scoreController.getRankingForAllUsers(...args))

		// GET /ranking_score?score=XYZ
		this.app.get('/ranking_score', (...args) => this.scoreController.getRankingForScore(...args))

		// POST /add_score , params: { name: XYZ, score: XYZ }, return /ranking_score
		this.app.post('/add_score', (...args) => this.scoreController.addScore(...args))

	}

}


module.exports = Router
