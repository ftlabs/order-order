/* eslint-disable import/no-dynamic-require */

const express = require('express');

const router = express.Router();
const s3o = require('@financial-times/s3o-middleware');
const path = require('path');
const adminRoutes = require('./admin/main');
const commentRoutes = require('../routes/comment');
const voteRoutes = require('../routes/vote');
const ratingRoutes = require('./rating');
const listing = require('../helpers/listings');
const Utils = require('../helpers/utils');
const dynamoDb = require('../models/dynamoDb');
const { getS3oUsername } = require('../helpers/cookies');

router.use(s3o);
router.use('/comment', commentRoutes);
router.use('/vote', voteRoutes);
router.use('/rating', ratingRoutes);
router.use('/admin', adminRoutes);

router.get('/', async (req, res, next) => {
	const username = getS3oUsername(req.cookies);

	try {
		const debateList = await dynamoDb.getAllDebateLists('flat');

		res.render('list', {
			pageTitle: 'FT Debates',
			pageSubtitle:
				"Welcome to FT debates, here's a list of all available debates and a bit more blurb on how to take part",
			pageType: 'home',
			debateList,
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			}
		});
	} catch (err) {
		next(err);
	}
});

router.get('/type/:debateType', async (req, res, next) => {
	const username = getS3oUsername(req.cookies);

	try {
		const { debateType } = req.params;
		const debateTypeDetails = await dynamoDb.getDebateType(debateType);

		if (!debateTypeDetails || debateTypeDetails.Items.length === 0) {
			next(`No debates found for debateType '${debateType}'`);
			return;
		}

		const debateList = await dynamoDb.getDebateList(debateType);
		const debateListByType = debateList[`${debateType}`].debates;
		const debateDescription = debateTypeDetails.Items[0].description;

		res.render('list', {
			pageTitle: `${debateType}`,
			pageSubtitle: debateDescription,
			pageType: 'home',
			debateList: debateListByType,
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			}
		});
	} catch (err) {
		next(err);
	}
});

router.get('/:debateId', async (req, res, next) => {
	try {
		const { debateId } = req.params;
		const result = await dynamoDb.getById(debateId);
		const username = getS3oUsername(req.cookies);
		const debate = result.Items[0];

		const data = {
			debate: debate,
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			}
		};

		if (debate && Utils.hasOwnPropertyCall(debate, 'debateType')) {
			/* eslint-disable global-require */

			const modulePath = path.resolve(
				`${listing.getRootDir()}/modules/${debate.debateType.toLowerCase()}`
			);
			const moduleType = require(modulePath);

			/* eslint-disable global-require */

			moduleType.display(req, res, data);
			return;
		} else {
			throw new Error(`Debate not found with the id: ${debateId}`);
			return;
		}
	} catch (err) {
		next(err);
	}
});

router.post('/:debateId', async (req, res, next) => {
	const backURL = req.header('Referer') || '/';
	try {
		const { debateId } = req.params;
		const formData = req.body;
		let data = {};
		if (formData.comment) {
			const { comment, tags, displayStatus, replyTo } = formData;
			data = {
				comments: [
					dynamoDb.constructCommentObject({
						content: comment,
						user: req.cookies.s3o_username,
						tags,
						replyTo,
						displayStatus
					})
				],
				...data
			};
		}

		await dynamoDb.updateDebate(debateId, data);
		res.redirect(backURL);
	} catch (err) {
		next(err);
	}
});

router.use(function(err, req, res, next) {
	console.log(err);
	res.status(404);

	if (req.accepts('html')) {
		res.render('404', {
			url: req.url,
			method: req.method,
			url: req.url,
			error: err,
			user: {
				username: getS3oUsername(req.cookies),
				usernameNice: Utils.cleanUsername(username)
			}
		});
		return;
	}

	if (req.accepts('json')) {
		res.send({ msg: 'Not found', error: err });
		return;
	}

	res.type('txt').send('Not found');
});

module.exports = router;
