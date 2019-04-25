const AWS = require('aws-sdk');

const LIST_TYPES = ['comments'];

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
});

async function query(type = 'query', params) {
  try {
    const baseParams = {
      TableName: process.env.DEBATE_TABLE,
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

async function getAllDebateLists() {
  const queryStatement = await query('scan', {});

  if (queryStatement.result) {
    const debates = {};

    queryStatement.result.Items.map(item => {
      if (!Object.prototype.hasOwnProperty.call(debates, item.debateType)) {
        debates[item.debateType] = {
          debateTypeName: item.debateType,
          debates: [],
        };
      }

      debates[item.debateType].debates.push(item);
      return true;
    });

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
  if (!replyTo) {
    replyTo = undefined;
  }
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

module.exports = {
  addDebate,
  editDebate,
  getAll,
  getById,
  getBy,
  getAllTypes,
  getDebateList,
  getAllDebateLists,
  getAllReports,
  updateDebate,
  constructCommentObject,
};