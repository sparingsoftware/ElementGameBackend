
class ScoreRepo {

	static setDB (db) {
		this.db_ = db
	}

	static get db () {
		return this.db_.mongoDb
	}

	static get collection () {
		return this.db.collection('scores')
	}

	//

	static addScore ({ user, score }) {
		return this.collection.updateOne(
			{ user },
			{ $max: { user, score } }, // insert only bigger value than existing
			{ upsert: true } // create if not exists
		)
	}

	static topScores (num=5) {
		return this.collection
			.find({})
			.project({ user: 1, score: 1, _id: 0 })
			.sort({ score: -1 })
			.limit(num)
			.toArray()
	}

	//

	static async userScore ({ user }) {
		const score = await this.collection.findOne({ user })

		const ranking = await this.collection.find({ score: { $gt: score.score }}).count() + 1

		return {
			score: score.score,
			user: user,
			ranking: ranking
		}
	}

}


module.exports = ScoreRepo
