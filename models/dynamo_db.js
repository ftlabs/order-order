const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "eu-west-1"
});

async function getAll() {
  let queryStatement = await query("get", {});

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement.result };
}

async function getById(name, seriesId) {
  let queryStatement = await query("get", {
    Key: { name, seriesId }
  });

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement.result };
}

async function getAllTypes() {
  const params = {
    ProjectionExpression: "debateType"
  };

  let queryStatement = await query("scan", params);
  const types = [];

  if (queryStatement.result) {
    queryStatement.result["Items"].forEach(result => {
      if (!types.includes(result.debateType)) {
        types.push(result.debateType);
      }
    });
    return types;
  }

  return { error: queryStatement.result };
}

async function query(type, params) {
  try {
    let result;
    let baseParams = {
      TableName: process.env.DEBATE_TABLE
    };

    const allParams = Object.assign(baseParams, params);

    if (type === "get") {
      result = await dynamoDb.get(allParams).promise();
    } else if (type === "scan") {
      result = await dynamoDb.scan(allParams).promise();
    } else if (type === "put") {
      result = await dynamoDb.put(allParams).promise();
    }

    if (result.hasOwnProperty("Items") || result.hasOwnProperty("Item")) {
      return { result };
    } else {
      return { result: [] };
    }
  } catch (err) {
    console.error(err);
    return `Error with request ${err}`;
  }
}

module.exports = {
  getAll,
  getById,
  getAllTypes
};
