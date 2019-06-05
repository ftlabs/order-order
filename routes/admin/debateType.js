const express = require('express');
const router = express.Router();
const Utils = require('../../helpers/utils');
const dynamoDb = require('../../models/dynamoDb');
const { getS3oUsername } = require('../../helpers/cookies');

router.get('/create', (req, res) => {
	try {
		const username = getS3oUsername(req.cookies);
		const { alertType, alertAction } = req.query;

		res.render('admin/createDebateType', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			page: 'create-type',
			alertMessage: getAlertMessage(
				alertType,
				alertAction ? alertAction : 'creating'
			),
			alertType
		});
	} catch (err) {
		console.error(err);
		res.status(404).send("Sorry can't find that!");
	}
});

router.post('/create', async (req, res) => {
	try {
		const {
			specialUsers,
			tags,
			name,
			description,
			displayName,
			createdBy
		} = req.body;
		const defaultSpecialUser = [
			{
				name: 'allowedUsers',
				description: 'Add users to a allow list.',
				displayName: 'Allowed Users'
			},
			{
				name: 'blockedUsers',
				description: 'Add users to a block list.',
				displayName: 'Blocked Users'
			}
		];
		let mergedSpecialUsers = [...defaultSpecialUser];
		if (specialUsers) {
			mergedSpecialUsers = [...mergedSpecialUsers, ...specialUsers];
		}

		const result = await dynamoDb.createDebateType({
			specialUsers: mergedSpecialUsers,
			tags,
			name,
			description,
			displayName,
			createdBy
		});
		if (result.error) {
			throw new Error(result.error);
		}
		res.redirect(
			`/admin/debate_type/edit/${name}?alertType=success&alertAction=creating`
		);
	} catch (err) {
		console.error(err);
		res.redirect(
			`/admin/debate_type/create?alertType=error&alertAction=creating`
		);
	}
});

router.get('/edit/:debateTypeName', async (req, res) => {
	try {
		const { alertType, alertAction } = req.query;
		const username = getS3oUsername(req.cookies);
		const { debateTypeName } = req.params;
		const debateType = await dynamoDb.getDebateType(debateTypeName);

		if (debateType.Items.length === 0) {
			throw new Error('Cant find debate type');
		}
		const {
			description,
			name,
			specialUsers = [],
			tags = [],
			displayName,
			createdBy,
			createdAt
		} = debateType.Items[0];

		res.render('admin/editDebateType', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			description,
			name,
			displayName,
			createdBy,
			createdAt,
			formatDate: Utils.formatDate(Number(createdAt)),
			specialUsers: specialUsers.map((specialUser, index) => ({
				...specialUser,
				index
			})),
			tags: tags.map((tags, index) => ({
				...tags,
				index
			})),
			page: 'edit-type',
			alertMessage: getAlertMessage(
				alertType,
				alertAction ? alertAction : 'editing'
			),
			alertType
		});
	} catch (err) {
		console.error(err);
		res.render('admin/editDebateType', {
			error: 'Something went wrong trying to get your debate type.',
			page: 'edit-type'
		});
	}
});

router.post('/edit/:debateTypeName', async (req, res) => {
	try {
		const {
			name,
			tags,
			specialUsers,
			description,
			displayName,
			createdAt,
			createdBy
		} = req.body;
		const { debateTypeName } = req.params;

		const result = await dynamoDb.createDebateType({
			specialUsers,
			tags,
			name: debateTypeName,
			description,
			displayName,
			createdAt,
			createdBy
		});
		if (result.error) {
			throw new Error(result.error);
		}
		res.redirect(
			`/admin/debate_type/edit/${debateTypeName}?alertType=success&alertAction=editing`
		);
	} catch (err) {
		console.error(err);
		res.redirect(
			`/admin/debate_type/edit/${debateTypeName}?alertType=error&alertAction=editing`
		);
	}
});

router.get('/list/:debateTypeName', async (req, res) => {
	const username = getS3oUsername(req.cookies);

	try {
		const { debateTypeName } = req.params;
		const debatesByType = await dynamoDb.getAllDebateLists();

		let debateTypeDisplayName =
			debatesByType[debateTypeName] &&
			debatesByType[debateTypeName].debateTypeDisplayName
				? debatesByType[debateTypeName].debateTypeDisplayName
				: '';

		res.render('admin/listDebatesByType', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			debateTypeDisplayName,
			debatesByType: debatesByType[debateTypeName],
			page: 'debatesByType'
		});
	} catch (err) {
		res.status(404).send("Sorry can't find that!");
	}
});

router.get('/list', async (req, res) => {
	const username = getS3oUsername(req.cookies);

	try {
		const debateTypeList = await dynamoDb.getAllDebateTypes();
		res.render('admin/listDebateTypes', {
			user: {
				username,
				usernameNice: Utils.cleanUsername(username)
			},
			debateTypeList: debateTypeList,
			page: 'debateTypes'
		});
	} catch (err) {
		res.status(404).send("Sorry can't find that!");
	}
});

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
