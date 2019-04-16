const express = require("express");
const router = express.Router();
const dynamo_db = require("../models/dynamo_db");

router.post("/debate/create", (req, res) => {
  try {
    const data = req.body;

    if (
      !data.name ||
      !data.seriesId ||
      !data.type ||
      !data.title ||
      !data.description
    ) {
      res.json({
        status: "error",
        msg: "Missing all required POST vars"
      });
      res.end();
      return;
    }

    fetch(`${req.protocol}://${req.get("host")}/api/debate`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(data)
    })
      .then(response => {
        res.json({
          status: "ok"
        });
      })
      .catch(err => {
        res.json({
          status: "error",
          msg: err
        });
      });
  } catch (err) {
    res.status(404).send(`Error: ${err}`);
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
        debateType: req.body.type,
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

router.get("/debate/:name/:seriesId", async (req, res) => {
  try {
    const { name, seriesId } = req.params;
    const debate = await dynamo_db.getById(name, seriesId);
    res.send(JSON.stringify(debate));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/debate/types", async (req, res) => {
  try {
    const allDebateTypes = await dynamo_db.getAllTypes();
    res.send(JSON.stringify(allDebateTypes));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
