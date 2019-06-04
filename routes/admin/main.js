const express = require('express');
const router = express.Router();
const dynamoDb = require('../../models/dynamoDb');
const { getS3oUsername } = require('../../helpers/cookies');
const Utils = require('../../helpers/utils');

const debateRoutes = require('./debate');
const debateTypeRoutes = require('./debateType');

router.get('/', async (req, res) => {
	const username = getS3oUsername(req.cookies);

	try {
		res.render('admin/index', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			page: 'dashboard'
		});
	} catch (err) {
		res.status(404).send("Sorry can't find that!");
	}
});

router.get('/moderation', async (req, res) => {
	const username = getS3oUsername(req.cookies);

	try {
		const reports = await dynamoDb.getAllReports();

		res.render('admin/moderation', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			reports,
			page: 'moderation'
		});
	} catch (err) {
		res.status(404).send("Sorry can't find that!");
	}
});

router.use('/debate', debateRoutes);
router.use('/debate_type', debateTypeRoutes);

module.exports = router;
