const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dynamoDb = require('../models/dynamoDb');

router.post('/remove/:debateId', async (req, res, next) => {
	try {
		const backURL = req.header('Referer') || '/';
		const { debateId } = req.params;
		const { username, commentId, ratingId } = req.body;

		await dynamoDb.removeDebateAttribute(debateId, {
			ratings: { id: ratingId, commentId }
		});
		res.redirect(backURL);
	} catch (err) {
		next(err);
	}
});

router.post('/:debateType/:debateId', async (req, res, next) => {
	try {
		const backURL = req.header('Referer') || '/';
		const { debateId, debateType } = req.params;
		const { rating, commentId } = req.body;
		const data = {
			ratings: dynamoDb.constructRatingObject({
				rating,
				commentId,
				user: req.cookies.s3o_username
			})
		};

		await customLogic({
			functionName: 'post',
			username: req.cookies.s3o_username,
			debateId,
			commentId,
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
	commentId,
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
			commentId,
			username
		});
	}
}

module.exports = router;
