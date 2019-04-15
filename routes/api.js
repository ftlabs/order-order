const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "eu-west-1"
});

router.post("/create_new_debate", (req, res) => {
  try {
    const data = req.body;
    const user = req.cookies.s3o_username;

    console.log(data);
    console.log(user);

    // TODO: add submission to data storage

    res.json({
      status: "ok"
    });
  } catch (err) {
    res.status(404).send("Sorry can't find that!");
  }
});

router.post("/debate", async (req, res) => {
  try {
    const timestamp = new Date().getTime();
    const params = {
      TableName: process.env.DEBATE_TABLE,
      Item: {
        name: req.body.name,
        seriesId: req.body.seriesId,
        type: req.body.type,
        permitted: [],
        restricted: [],
        specialUsers: [],
        comments: [],
        starter: [
          { type: "title", text: req.body.title },
          { type: "description", text: req.body.description }
        ],
        state: [],
        teams: [],
        votes: [],
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };
    const result = await dynamoDb.put(params).promise();
    console.log(result);
    res.send(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/debate", async (req, res) => {
  console.log(req.query);
  try {
    const params = {
      TableName: process.env.DEBATE_TABLE,
      Key: {
        name: req.query.name,
        seriesId: req.query.seriesId
      }
    };
    const result = await dynamoDb.get(params).promise();
    res.send(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
