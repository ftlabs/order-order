const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dynamoDb = require('../models/dynamoDb');

router.post('/remove/:debateId', async (req, res, next) => {
	try {
		const backURL = req.header('Referer') || '/';
		const { debateId } = req.params;
		const { username, index } = req.body;

		const debate = await dynamoDb.getById(debateId);

		if (debate && debate.Items && debate.Items.length > 0) {
			const comment = debate.Items[0].comments[index];
			const ratings = comment.ratings;

			ratings.forEach((rating, index) => {
				if (rating.user === username) {
					ratings.splice(index, 1);
				}
			});

			debate.Items[0].comments[index].ratings = ratings;
		}

		const newData = {
			comments: debate.Items[0].comments
		};

		await dynamoDb.updateDebate(debateId, newData, true);
		res.redirect(backURL);
	} catch (err) {
		next(err);
	}
});

router.post('/:debateType/:debateId', async (req, res, next) => {
	try {
		const backURL = req.header('Referer') || '/';
		const { debateId, debateType } = req.params;
		const { rating, index } = req.body;
		const data = {
			ratings: [
				dynamoDb.constructRatingObject({
					rating,
					index,
					user: req.cookies.s3o_username
				})
			]
		};

		await customLogic({
			functionName: 'post',
			username: req.cookies.s3o_username,
			debateId,
			index,
			debateType
		});
		await dynamoDb.updateDebate(debateId, data);
		res.redirect(backURL);
	} catch (err) {
		next(err);
	}
});

async function customLogic({
	functionName,
	debateId,
	index,
	debateType,
	username
}) {
	const helperFilePath = path.resolve(
		`./helpers/routeHelpers/${debateType}/rating.js`
	);
	if (fs.existsSync(helperFilePath)) {
		const debateTypeHelper = require(helperFilePath);
		await debateTypeHelper[functionName]({
			debateId,
			index,
			username
		});
	}
}

module.exports = router;
