const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dynamoDb = require('../../models/dynamoDb');
const { getS3oUsername } = require('../../helpers/cookies');
const Utils = require('../../helpers/utils');

router.get('/create', async (req, res) => {
	try {
		const username = getS3oUsername(req.cookies);
		let debateTypes = await dynamoDb.getAllDebateTypes();
		const { alertType, alertAction } = req.query;
		debateTypes = debateTypes.Items.map((debateType) => ({
			...debateType,
			valid: validateDebateTypeFile(debateType.name)
		}));
		res.render('admin/createDebate', {
			debateTypes: debateTypes.Items,
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			page: 'create',
			alertMessage: getAlertMessage(
				alertType,
				alertAction ? alertAction : 'creating'
			),
			alertType
		});
	} catch (err) {
		console.error(err);
	}
});

router.post('/create', async (req, res) => {
	try {
		const {
			debateType,
			title,
			description,
			debateStatus,
			votingStatus,
			specialUsers,
			tags,
			createdBy
		} = req.body;

		if ((!debateType, !title, !description, !debateStatus, !votingStatus)) {
			throw new Error(
				'One of the required fields was not filled in correctly.'
			);
		}
		const specialUsersFormatted = specialUsers
			? formatSpecialUsers(specialUsers)
			: [];

		const params = {
			debateType,
			title,
			description,
			debateStatus,
			votingStatus,
			specialUsers: specialUsersFormatted,
			tags,
			createdBy
		};
		const results = await dynamoDb.createDebate(params);
		res.redirect(`/${results.id}`);
	} catch (err) {
		console.error(err);
		res.redirect(
			`/admin/debate/create?alertType=error&alertAction=creating`
		);
	}
});

router.get('/edit/:debateId', async (req, res) => {
	const username = getS3oUsername(req.cookies);
	try {
		const { debateId } = req.params;
		const { alertType, alertAction } = req.query;
		const debate = await dynamoDb.getById(debateId);

		if (!debate.Items || debate.Items.length === 0) {
			res.status(404).send('Sorry no debate with that id');
			return;
		}

		const {
			id,
			debateType,
			debateStatus,
			description,
			title,
			votingStatus,
			specialUsers,
			tags,
			createdBy
		} = debate.Items[0];

		const debateTypeInformation = await dynamoDb.getDebateType(debateType);
		let specialUsersInformation = [];
		if (specialUsers && specialUsers.length > 0) {
			specialUsersInformation = debateTypeInformation.Items[0].specialUsers.map(
				(userType) => {
					const userList = specialUsers.find(
						(userInformation) =>
							userInformation.userType === userType.name
					);
					return { ...userType, ...userList };
				}
			);
		}
		let tagsWithInformation = [];
		if (tags && tags.length > 0) {
			tagsWithInformation = debateTypeInformation.Items[0].tags.map(
				(tagType) => {
					const checked = tags.includes(tagType.name);
					return { ...tagType, checked };
				}
			);
		}
		res.render('admin/editDebate', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			id,
			debateType,
			debateStatus,
			description,
			title,
			votingStatus,
			specialUsersInformation,
			tagsWithInformation,
			createdBy,
			page: 'edit',
			alertMessage: getAlertMessage(
				alertType,
				alertAction ? alertAction : 'editing'
			),
			alertType
		});
	} catch (err) {
		console.error(err);
		res.redirect(
			`/admin/debate/edit/${id}?alertType=error&alertAction=editing`
		);
	}
});

router.post('/edit/:debateId', async (req, res) => {
	try {
		const { debateId } = req.params;
		const {
			debateType,
			title,
			description,
			debateStatus,
			votingStatus,
			specialUsers,
			tags
		} = req.body;
		if ((!debateType, !title, !description, !debateStatus, !votingStatus)) {
			throw new Error(
				'One of the required fields was not filled in correctly.'
			);
		}
		const specialUsersFormatted = specialUsers
			? formatSpecialUsers(specialUsers)
			: [];
		const params = {
			title,
			description,
			debateStatus,
			votingStatus,
			specialUsers: specialUsersFormatted,
			tags
		};
		await dynamoDb.updateDebate(debateId, params);
		res.redirect(
			`/admin/debate/edit/${debateId}?alertType=success&alertAction=editing`
		);
	} catch (err) {
		console.error(err);
		res.redirect(
			`/admin/debate/edit/${debateId}?alertType=error&alertAction=editing`
		);
	}
});

router.get('/list', async (req, res) => {
	const username = getS3oUsername(req.cookies);
	try {
		const debateList = await dynamoDb.getAllDebateLists();
		res.render('admin/listDebates', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			debateList,
			page: 'debates'
		});
	} catch (err) {
		res.status(404).send("Sorry can't find that!");
	}
});

function validateDebateTypeFile(debateTypeName) {
	try {
		const filePath = path.resolve(
			`./modules/${debateTypeName.toLowerCase()}.js`
		);
		if (fs.existsSync(filePath)) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		console.error(err);
		return false;
	}
}

function formatSpecialUsers(specialUsers) {
	let specialUsersFormatted = [];
	Object.keys(specialUsers).forEach((userType) => {
		if (typeof specialUsers[userType] === 'string') {
			specialUsers[userType] = [specialUsers[userType]];
		}
		specialUsersFormatted = [
			...specialUsersFormatted,
			{ userType, users: specialUsers[userType] }
		];
	});
	return specialUsersFormatted;
}

function getAlertMessage(alertType, action) {
	switch (alertType) {
		case 'success':
			return `${action} your debate type was succesful.`;
		case 'error':
			return `Something went wrong ${action} your debate type.`;
		default:
			return undefined;
	}
}

module.exports = router;
