
class ScoreRepo {

	static setDB (db) {
		this.db_ = db
	}

	static get db () {
		return this.db_.mongoDb
	}

	static get collection () {
		return this.db.collection('users')
	}

	//

	static addScore (score = { user: '', score: 0 }) {
		return this.collection.insertOne(user)
	}

	static topScores (num=10) {
		return new Promise((resolve, reject) => {
			const ranking = [
				{
					user: 'Michal',
					score: '1234',
					ranking: '1'
				},
				{
					user: 'Kuba',
					score: '1009',
					ranking: '2'
				},
				{
					user: 'Jan',
					score: '999',
					ranking: '3'
				},
				{
					user: 'Mis',
					score: '650',
					ranking: '4'
				},
				{
					user: 'Ania',
					score: '567',
					ranking: '5'
				}
			]

			resolve(ranking)
		})
	}

	//

	static userScore ({ user, userScore=370 }) {
		return new Promise((resolve, reject) => {
			const score = {
				user: user,
				score: userScore,
				ranking: '9'
			}

			resolve(score)
		})
	}

	static addScore ({ user = '', score = 370 }) {
		return new Promise((resolve, reject) => {
			resolve()
		})
	}

}


module.exports = ScoreRepo
