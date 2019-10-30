/* eslint-disable import/no-dynamic-require */

const express = require('express');

const router = express.Router();
const OktaMiddleware = require('@financial-times/okta-express-middleware');
const path = require('path');
const adminRoutes = require('./admin/main');
const commentRoutes = require('../routes/comment');
const voteRoutes = require('../routes/vote');
const ratingRoutes = require('./rating');
const listing = require('../helpers/listings');
const Utils = require('../helpers/utils');
const dynamoDb = require('../models/dynamoDb');
const { getOktaUsername } = require('../helpers/cookies');

const okta = new OktaMiddleware({
	client_id: process.env.OKTA_CLIENT,
	client_secret: process.env.OKTA_SECRET,
	issuer: process.env.OKTA_ISSUER,
	appBaseUrl: process.env.BASE_URL,
	scope: 'openid offline_access name'
});

router.use(okta.router);
router.use(okta.ensureAuthenticated());
router.use(okta.verifyJwts());

router.use('/comment', commentRoutes);
router.use('/vote', voteRoutes);
router.use('/rating', ratingRoutes);
router.use('/admin', adminRoutes);

router.get('/', async (req, res, next) => {
	const username = getOktaUsername(req.userContext.userinfo);


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
	const username = getOktaUsername(req.userContext.userinfo);

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
		const username = getOktaUsername(req.userContext.userinfo)
		const debate = result.Items[0];
		const debateTypeData = await dynamoDb.getDebateType(debate.debateType);
		const debateTypeDescription = debateTypeData.Items[0].description;

		const data = {
			debate,
			debateTypeDescription,
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

		const username = getOktaUsername(req.userContext.userinfo);
		if (formData.comment) {
			const { comment, tags, displayStatus, replyTo } = formData;
			data = {
				comments: [
					dynamoDb.constructCommentObject({
						content: comment,
						user: username,
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

	const username = getOktaUsername(req.userContext.userinfo);
	console.log(err);
	res.status(404);

	if (req.accepts('html')) {
		res.render('404', {
			url: req.url,
			method: req.method,
			url: req.url,
			error: err,
			user: {
				username: username,
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
