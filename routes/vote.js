const express = require('express');
const router = express.Router();
const dynamoDb = require('../models/dynamoDb');
const { getOktaUsername } = require('../helpers/cookies');

router.post('/:debateId', async (req, res, next) => {
	try {
		const backURL = req.header('Referer') || '/';
		const { debateId } = req.params;
		const { tags } = req.body;
		
		const data = {
			debateRatings: [
				dynamoDb.constructRatingObject({
					rating: tags[0],
					user: getOktaUsername(req.userContext.userinfo),
					index: debateId
				})
			]
		};
		await dynamoDb.updateDebate(debateId, data);
		res.redirect(backURL);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
