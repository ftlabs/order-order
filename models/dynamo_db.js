const AWS = require('aws-sdk');
const LIST_TYPES = ['comments'];

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
});

async function addDebate(params) {
  const queryStatement = await query('put', params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement.result };
}

async function getAll() {
  const queryStatement = await query('scan', {});

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement.result };
}

async function getById(debateId) {
  const params = {
    KeyConditionExpression: 'id = :debateId',
    ExpressionAttributeValues: {
      ':debateId': debateId,
    },
  };

  let queryStatement = await query('query', params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement.result };
}

async function getAllTypes() {
  const params = {
    ProjectionExpression: 'debateType',
  };

  let queryStatement = await query('scan', params);
  const types = [];

  if (queryStatement.result) {
    queryStatement.result['Items'].forEach(result => {
      if (!types.includes(result.debateType)) {
        types.push(result.debateType);
      }
    });
    return types;
  }

  return { error: queryStatement.result };
}

async function getAllDebateLists() {
  let queryStatement = await query('scan', {});

  if (queryStatement.result) {
    let debates = {};

    queryStatement.result['Items'].map(item => {
      if (!debates.hasOwnProperty(item.debateType)) {
        debates[item.debateType] = {
          debateTypeName: item.debateType,
          debates: [],
        };
      }

      debates[item.debateType].debates.push(item);
    });

    return debates;
  }

  return { error: queryStatement.result };
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

  let queryStatement = await query('scan', params);

  if (queryStatement.result) {
    let debates = {};

    queryStatement.result['Items'].map(item => {
      if (!debates.hasOwnProperty(item.debateType)) {
        debates[item.debateType] = {
          debateTypeName: item.debateType,
          debates: [],
        };
      }

      debates[item.debateType].debates.push(item);
    });

    return debates;
  }

  return { error: queryStatement.result };
}

async function getAllReports() {
  const params = {
    //TODO
  };

  let queryStatement = await query('scan', params);
  const types = [];

  if (queryStatement.result) {
    // TODO: list all content with reports
  }

  return { error: queryStatement.result };
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
    console.log(result);
    return result.result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function updateExpressionConstruct(data) {
  data = { ...data, updatedAt: new Date().getTime() };
  let expressionAttributeValues = {};
  let updateExpression = 'SET';
  const fields = Object.keys(data);
  fields.forEach((key, index) => {
    expressionAttributeValues = {
      ...expressionAttributeValues,
      [`:${key}`]: data[key],
    };
    if (LIST_TYPES.includes(key)) {
      updateExpression =
        updateExpression + ` ${key}=list_append(${key}, :${key})`;
    } else {
      updateExpression = updateExpression + ` ${key}=:${key}`;
    }
    if (fields.length !== index + 1) {
      updateExpression = updateExpression + ',';
    }
  });
  return {
    ExpressionAttributeValues: expressionAttributeValues,
    UpdateExpression: updateExpression,
  };
}

async function query(type, params) {
  try {
    const baseParams = {
      TableName: process.env.DEBATE_TABLE,
    };

    const allParams = Object.assign(baseParams, params);

    const result = await dynamoDb[type](allParams).promise();
    console.log(result);

    if (result.hasOwnProperty('Items') || result.hasOwnProperty('Item')) {
      return { result };
    }
    return { result: [] };
  } catch (err) {
    console.error(err);
    return `Error with request ${err}`;
  }
}

module.exports = {
  addDebate,
  getAll,
  getById,
  getAllTypes,
  getDebateList,
  getAllDebateLists,
  getAllReports,
  updateDebate,
};
