"use strict";

const { lstatSync, readdirSync } = require("fs");
const { dirname, join } = require("path");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "eu-west-1"
});

function getRootDir() {
  return dirname(require.main.filename || process.mainModule.filename);
}

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(path => {
      let arr = path.split("/");
      return {
        type: arr[arr.length - 1],
        path: path
      };
    });

function getDebateListings(folder, searchedType = "") {
  const directoryList = getDirectories(`${getRootDir()}/${folder}/`);
  directoryList.forEach(collection => {
    if (collection.type === searchedType || searchedType === "") {
      collection.debateTypeName = collection.type;
      collection.debates = [];

      const files = readdirSync(collection.path);
      files.forEach(file => {
        if (file.endsWith(".json")) {
          collection.debates.push(file.replace(".json", ""));
        }
      });
    }
  });

  return directoryList;
}

async function getDynamoDebateListings() {
  /*
  try {
    const params = {
      TableName: process.env.DEBATE_TABLE
    };
    const result = await dynamoDb.get(params).promise();
    res.send(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
  */

  return [];
}

module.exports = {
  getRootDir,
  getDebateListings,
  getDynamoDebateListings
};