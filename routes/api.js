const express = require("express");
const router = express.Router();
const dynamo_db = require("../models/dynamo_db");

router.post("/debate/create", async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.type ||
      !data.title ||
      !data.description ||
      !data.status ||
      !data.voting_status
    ) {
      res.json({
        status: "error",
        msg: "Missing all required POST vars"
      });
      res.end();
      return;
    }

    const timestamp = new Date().getTime();
    const params = {
      Item: {
        title: data.title,
        description: data.description,
        debateType: data.type,
        comments: [],
        status: [],
        voting_status: [],
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };
    const debate = await dynamo_db.addDebate(params);
    res.send(JSON.stringify(debate));
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .send("Sorry can't find that! Issue with POST /debate/create");
  }
});

router.get("/debate/:name/:seriesId", async (req, res) => {
  try {
    const { name, seriesId } = req.params;
    const debate = await dynamo_db.getById(name, seriesId);
    res.send(JSON.stringify(debate));
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .send(
        `Sorry can't find that! Issue with GET /debate/${name}/${seriesId}`
      );
  }
});

router.get("/debate/types", async (req, res) => {
  try {
    const allDebateTypes = await dynamo_db.getAllTypes();
    res.send(JSON.stringify(allDebateTypes));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that! Issue with GET /debate/types");
  }
});

module.exports = router;
