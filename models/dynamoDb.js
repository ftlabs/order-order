const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const Utils = require('../helpers/utils');

const LIST_TYPES = ['comments'];
const NESTED_LIST_TYPES = ['ratings'];

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
});

async function query(
  type = 'query',
  params,
  tableName = process.env.DEBATE_TABLE,
) {
  try {
    console.log('tableName', tableName);
    const baseParams = {
      TableName: tableName,
    };

    const allParams = Object.assign(baseParams, params);
    const result = await dynamoDb[type](allParams).promise();

    return { result };
  } catch (err) {
    return `Error with request ${err}`;
  }
}

async function addDebate(data) {
  const params = {
    Item: {
      id: data.id,
      title: data.title,
      description: data.description,
      debateType: data.debateType,
      comments: [],
      debateStatus: data.debateStatus,
      votingStatus: data.votingStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  };

  const queryStatement = await query('put', params);
  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement };
}

async function editDebate(data) {
  const params = {
    Key: {
      id: String(data.id),
    },
    UpdateExpression:
      'set title=:t, description=:d, debateStatus=:s, votingStatus=:vs, updatedAt=:u',
    ExpressionAttributeValues: {
      ':t': data.title,
      ':d': data.description,
      ':s': data.debateStatus,
      ':vs': data.votingStatus,
      ':u': data.timestamp,
    },
    ReturnValues: 'UPDATED_NEW',
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
      ':debateId': debateId,
    },
  };

  const queryStatement = await query('query', params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement.result };
}

async function getBy(attribute, value) {
  const params = {
    FilterExpression: `${attribute} = :v`,
    ExpressionAttributeValues: {
      ':v': value,
    },
  };

  const queryStatement = await query('scan', params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement };
}

<<<<<<< HEAD
async function getAllTypes() {
  const params = {
    ProjectionExpression: 'debateType',
  };

  const queryStatement = await query('scan', params);
  const types = [];

  if (queryStatement.result) {
    queryStatement.result.Items.forEach(result => {
      if (!types.includes(result.debateType)) {
        types.push(result.debateType);
      }
    });
    return types;
  }

  return { error: queryStatement };
}

=======
>>>>>>> new files
async function getAllDebateLists(type = 'nested') {
  const queryStatement = await query('scan', {});

  if (queryStatement.result) {
    let debates;

    if (type === 'flat') {
      debates = [];
      queryStatement.result['Items'].forEach(item => {
        item.formatDate = Utils.formatDate(item.createdAt);
        debates.push(item);
      });

      Utils.sortByDate(debates, 'createdAt');
    } else {
      debates = {};
      queryStatement.result['Items'].map(item => {
        if (!debates.hasOwnProperty(item.debateType)) {
          debates[item.debateType] = {
            debateTypeName: item.debateType,
            debates: [],
          };
        }
        debates[item.debateType].debates.push(item);
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
      '#ty': 'debateType',
    },
    ExpressionAttributeValues: {
      ':type_str': type,
    },
  };

  const queryStatement = await query('scan', params);

  if (queryStatement.result) {
    const debates = {};

    queryStatement.result.Items.map(item => {
      if (!Object.prototype.hasOwnProperty.call(debates, item.debateType)) {
        debates[item.debateType] = {
          debateTypeName: item.debateType,
          debates: [],
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

function updateExpressionConstruct(data) {
  const newData = { ...data, updatedAt: new Date().getTime() };
  let expressionAttributeValues = {};
  let updateExpression = 'SET';
  const fields = Object.keys(newData);
  fields.forEach((key, index) => {
    expressionAttributeValues = {
      ...expressionAttributeValues,
      [`:${key}`]: newData[key],
    };
    if (LIST_TYPES.includes(key)) {
      updateExpression += ` ${key}=list_append(${key}, :${key})`;
    } else if (NESTED_LIST_TYPES.includes(key)) {
      updateExpression += ` comments[${
        data[key][0].index
      }].${key}=list_append(comments[${data[key][0].index}].${key}, :${key})`;
    } else {
      updateExpression += ` ${key}=:${key}`;
    }
    if (fields.length !== index + 1) {
      updateExpression += ',';
    }
  });
  return {
    ExpressionAttributeValues: expressionAttributeValues,
    UpdateExpression: updateExpression,
  };
}

async function updateDebate(uuid, data) {
  try {
    const params = {
      Key: {
        id: uuid,
      },
      ReturnValues: 'ALL_NEW',
      ...updateExpressionConstruct(data),
    };
    const result = await query('update', params);
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
  displayStatus = 'show',
}) {
  const date = new Date().getTime();
  replyTo = !replyTo ? undefined : replyTo;
  return {
    id: uuidv1(),
    user,
    content,
    ratings: [],
    tags,
    replyTo,
    displayStatus,
    reports: [],
    updatedAt: date,
    createdAt: date,
  };
}

function constructRatingObject({ rating, user, index }) {
  const createdAt = new Date().getTime();
  return {
    id: uuidv1(),
    user,
    rating,
    createdAt,
    index,
  };
}

async function createDebateType({
  name,
  description,
  specialUsers,
  displayName,
}) {
  const params = {
    Item: {
      name,
      description,
      specialUsers,
      displayName,
    },
  };

  const queryStatement = await query(
    'put',
    params,
    process.env.DEBATE_TYPE_TABLE,
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
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':debateTypeName': debateTypeName,
    },
  };

  const queryStatement = await query(
    'query',
    params,
    process.env.DEBATE_TYPE_TABLE,
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
      process.env.DEBATE_TYPE_TABLE,
    );
    if (queryStatement.result) {
      return queryStatement.result;
    }
    throw new Error('No result');
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  addDebate,
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
};
