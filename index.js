const dotenv = require("dotenv").config({
  silent: process.env.NODE_ENVIRONMENT === "production"
});

const express = require("express");
const path = require("path");
const app = express();

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "eu-west-1"
});

// view engine setup
var hbs = require("express-hbs");

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials"
  })
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use("/static", express.static(path.resolve(__dirname + "/static")));

app.use(express.json());

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("ERROR: PORT not specified in env");
}

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/debate", async (req, res) => {
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

app.get("/debate", async (req, res) => {
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

app.get("/:debateType/:debateName", (req, res) => {
  try {
    const { debateName, debateType } = req.params;
    const data = require(`./dummyData/${debateType}/${debateName}.json`);
    const moduleType = require(`./modules/${debateType}`);
    moduleType.render(req, res, data);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
