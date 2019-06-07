const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const Utils = require('../helpers/utils');

const LIST_TYPES = ['comments'];
const NESTED_LIST_TYPES = ['ratings'];

const dynamoDb = new AWS.DynamoDB.DocumentClient({
	region: 'eu-west-1'
});

async function query(
	type = 'query',
	params,
	tableName = process.env.DEBATE_TABLE
) {
	try {
		const baseParams = {
			TableName: tableName
		};

		const allParams = Object.assign(baseParams, params);
		const result = await dynamoDb[type](allParams).promise();

		return { result };
	} catch (err) {
		return `Error with request ${err}`;
	}
}

async function createDebate(data) {
	try {
		const date = new Date().getTime();
		const id = uuidv1();
		const createdAt = date;
		const updatedAt = date;
		const params = {
			Item: {
				...data,
				id,
				comments: {},
				createdAt,
				updatedAt
			}
		};

		await query('put', params);
		return params.Item;
	} catch (err) {
		throw new Error(err);
	}
}

async function editDebate(data) {
	const params = {
		Key: {
			id: String(data.id)
		},
		UpdateExpression:
			'set title=:t, description=:d, debateStatus=:s, votingStatus=:vs, updatedAt=:u',
		ExpressionAttributeValues: {
			':t': data.title,
			':d': data.description,
			':s': data.debateStatus,
			':vs': data.votingStatus,
			':u': data.timestamp
		},
		ReturnValues: 'UPDATED_NEW'
	};

	const queryStatement = await query('update', params);

	if (queryStatement.result) {
		return queryStatement.result;
	}

	return { error: queryStatement };
}

async function getAll() {
	const queryStatement = await query('scan', {});

	if (queryStatement.result) {
		return queryStatement.result;
	}

	return { error: queryStatement };
}

async function getById(debateId) {
	const params = {
		KeyConditionExpression: 'id = :debateId',
		ExpressionAttributeValues: {
			':debateId': debateId
		}
	};

	const queryStatement = await query('query', params);
	if (queryStatement.result) {
		return normaliseData(queryStatement.result);
	}

	return { error: queryStatement.result };
}

function normaliseData(data) {
	if (data.Items[0].comments) {
		const commentsAsArray = Object.keys(data.Items[0].comments).map(
			(key) => data.Items[0].comments[key]
		);
		const commentsAndRatingsAsArrays = commentsAsArray.map((comment) => {
			if (comment.ratings) {
				comment.ratings = Object.keys(comment.ratings).map(
					(ratingId) => comment.ratings[ratingId]
				);
			}
			return comment;
		});
		data.Items[0].comments = commentsAndRatingsAsArrays;
	}
	return data;
}

async function getBy(attribute, value) {
	const params = {
		FilterExpression: `${attribute} = :v`,
		ExpressionAttributeValues: {
			':v': value
		}
	};

	const queryStatement = await query('scan', params);

	if (queryStatement.result) {
		return normaliseData(queryStatement.result);
	}

	return { error: queryStatement };
}

async function getAllTypes() {
	const params = {
		ProjectionExpression: 'debateType'
	};

	const queryStatement = await query('scan', params);
	const types = [];

	if (queryStatement.result) {
		queryStatement.result.Items.forEach((result) => {
			if (!types.includes(result.debateType)) {
				types.push(result.debateType);
			}
		});
		return types;
	}

	return { error: queryStatement };
}

async function getAllDebateLists(type = 'nested') {
	const queryStatement = await query('scan', {});

	if (queryStatement.result) {
		let debates;

		if (type === 'flat') {
			debates = [];
			queryStatement.result['Items'].forEach((item) => {
				item.formatDate = Utils.formatDate(item.createdAt);
				item.descriptionTruncated = Utils.trimDescription(
					item.description
				);
				debates.push(item);
			});

			Utils.sortByDate(debates, 'createdAt');
		} else {
			debates = {};

			const debateTypes = await getAllDebateTypes();
			let debateTypeDetails = [];

			debateTypes.forEach((type) => {
				debateTypeDetails[type.name] = type.displayName;
			});

			queryStatement.result['Items'].map((item) => {
				if (!debates.hasOwnProperty(item.debateType)) {
					debates[item.debateType] = {
						debateTypeName: item.debateType,
						debateTypeDisplayName:
							debateTypeDetails[item.debateType],
						debates: []
					};
				}

				item.formatDate = Utils.formatDate(item.createdAt);
				item.descriptionTruncated = Utils.trimDescription(
					item.description
				);

				debates[item.debateType].debates.push(item);
				Utils.sortByDate(debates[item.debateType].debates, 'createdAt');
			});
		}

		return debates;
	}

	return { error: queryStatement };
}

async function getDebateList(type) {
	const params = {
		FilterExpression: '#ty = :type_str',
		ExpressionAttributeNames: {
			'#ty': 'debateType'
		},
		ExpressionAttributeValues: {
			':type_str': type
		}
	};

	const queryStatement = await query('scan', params);

	if (queryStatement.result) {
		const debates = {};

		queryStatement.result.Items.map((item) => {
			if (!Utils.hasOwnPropertyCall(debates, item.debateType)) {
				debates[item.debateType] = {
					debateTypeName: item.debateType,
					debates: []
				};
			}

			item.formatDate = Utils.formatDate(item.createdAt);
			debates[item.debateType].debates.push(item);
			return true;
		});

		return debates;
	}

	return { error: queryStatement };
}

async function getAllReports() {
	const params = {
		// TODO
	};

	const queryStatement = await query('scan', params);

	if (queryStatement.result) {
		// TODO: list all content with reports
	}

	return { error: queryStatement };
}

function updateExpressionConstruct(data, removeData) {
	const newData = { ...data, updatedAt: new Date().getTime() };
	let fullExpression = {};
	let expressionAttributeValues = {};
	let updateExpression = 'SET';
	const fields = Object.keys(newData);
	fields.forEach((key, index) => {
		expressionAttributeValues = {
			...expressionAttributeValues,
			[`:${key}`]: newData[key]
		};
		if (LIST_TYPES.includes(key)) {
			fullExpression = {
				...fullExpression,
				ExpressionAttributeNames: { '#id': data[key].id },
				ConditionExpression: `attribute_not_exists(${key}.#id)`
			};
			updateExpression += ` ${key}.#id=:${key}`;
		} else if (NESTED_LIST_TYPES.includes(key)) {
			fullExpression = {
				...fullExpression,
				ExpressionAttributeNames: {
					'#commentId': data[key].commentId,
					'#id': data[key].id
				},
				ConditionExpression: `attribute_not_exists(${key}.#commentId.ratings.#id)`
			};
			updateExpression += ` comments.#commentId.${key}.#id=:${key}`;
		} else {
			updateExpression += ` ${key}=:${key}`;
		}
		if (fields.length !== index + 1) {
			updateExpression += ',';
		}
	});

	if (removeData) {
		const {
			removeDataUpdateExpression,
			removeDataFullExpression
		} = removeExpressionConstruct(removeData);

		updateExpression += removeDataUpdateExpression;
		const removeFields = Object.keys(removeData);
		fullExpression = {
			...fullExpression,
			...removeDataFullExpression
		};
	}

	return {
		...fullExpression,
		ExpressionAttributeValues: expressionAttributeValues,
		UpdateExpression: updateExpression
	};
}

function removeExpressionConstruct(removeData) {
	removeDataUpdateExpression = '';
	removeDataFullExpression = {};

	removeDataUpdateExpression += ' REMOVE';
	const removeFields = Object.keys(removeData);

	removeFields.forEach((key, index) => {
		if (NESTED_LIST_TYPES.includes(key)) {
			removeDataFullExpression = {
				ExpressionAttributeNames: {
					'#commentId': removeData[key].commentId,
					'#id': removeData[key].id
				}
			};
			removeDataUpdateExpression += ` comments.#commentId.${key}.#id`;
		} else {
			removeDataUpdateExpression += ` ${key}`;
		}
		if (removeFields.length !== index + 1) {
			removeDataUpdateExpression += ',';
		}
	});
	return { removeDataUpdateExpression, removeDataFullExpression };
}

async function updateDebate(uuid, data) {
	try {
		const params = {
			Key: {
				id: uuid
			},
			ReturnValues: 'ALL_NEW',
			...updateExpressionConstruct(data)
		};
		const result = await query('update', params);
		if (typeof result === 'string') {
			throw new Error(result);
		}
		return result.result;
	} catch (err) {
		throw err;
	}
}

async function removeDebateAttribute(uuid, data) {
	try {
		const params = {
			Key: {
				id: uuid
			},
			ReturnValues: 'ALL_NEW',
			...updateExpressionConstruct({}, data)
		};

		const result = await query('update', params);
		if (typeof result === 'string') {
			throw new Error(result);
		}
		return result.result;
	} catch (err) {
		throw err;
	}
}

function constructCommentObject({
	user,
	content,
	tags = [],
	replyTo = undefined,
	displayStatus = 'show'
}) {
	const date = new Date().getTime();
	replyTo = !replyTo ? undefined : replyTo;
	return {
		id: uuidv1(),
		user,
		content,
		ratings: {},
		tags,
		replyTo,
		displayStatus,
		reports: {},
		updatedAt: date,
		createdAt: date
	};
}

function constructRatingObject({ rating, user, commentId }) {
	const createdAt = new Date().getTime();
	return {
		id: uuidv1(),
		user,
		rating,
		createdAt,
		commentId
	};
}

async function createDebateType({
	name,
	description,
	tags,
	specialUsers,
	displayName,
	createdBy,
	createdAt = null
}) {
	const date = new Date().getTime();
	const updatedAt = date;

	if (createdAt === null) {
		createdAt = date;
	} else {
		createdAt = Number(createdAt);
	}

	const params = {
		Item: {
			name,
			tags,
			description,
			specialUsers,
			displayName,
			createdBy,
			createdAt,
			updatedAt
		}
	};

	const queryStatement = await query(
		'put',
		params,
		process.env.DEBATE_TYPE_TABLE
	);

	if (queryStatement.result) {
		return queryStatement.result;
	}

	return { error: queryStatement };
}

async function getDebateType(debateTypeName) {
	const params = {
		KeyConditionExpression: '#name = :debateTypeName',
		ExpressionAttributeNames: {
			'#name': 'name'
		},
		ExpressionAttributeValues: {
			':debateTypeName': debateTypeName
		}
	};

	const queryStatement = await query(
		'query',
		params,
		process.env.DEBATE_TYPE_TABLE
	);

	if (queryStatement.result) {
		return queryStatement.result;
	}

	return { error: queryStatement.result };
}

async function getAllDebateTypes() {
	try {
		const queryStatement = await query(
			'scan',
			{},
			process.env.DEBATE_TYPE_TABLE
		);
		if (queryStatement.result) {
			let debateTypes = [];
			queryStatement.result['Items'].forEach((item) => {
				item.formatDate = Utils.formatDate(item.createdAt);
				item.descriptionTruncated = Utils.trimDescription(
					item.description,
					150
				);
				debateTypes.push(item);
			});
			return debateTypes;
		}
		throw new Error('No result');
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	createDebate,
	editDebate,
	getAll,
	getById,
	getBy,
	getDebateList,
	getAllDebateLists,
	getAllReports,
	updateDebate,
	constructCommentObject,
	constructRatingObject,
	createDebateType,
	getDebateType,
	getAllDebateTypes,
	removeDebateAttribute
};
