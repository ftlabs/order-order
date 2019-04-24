const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1");
const dynamo_db = require("../models/dynamo_db");

router.post("/debate/create", async (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().getTime();

    if (
      !data.debate_type ||
      !data.title ||
      !data.description ||
      !data.debate_status ||
      !data.voting_status
    ) {
      res.json({
        status: "error",
        msg: "Missing all required POST vars"
      });
      res.end();
      return;
    }

    data.id = uuidv1();
    data.timestamp = new Date().getTime();
    data.createdAt = timestamp;
    data.updatedAt = timestamp;

    const debate = await dynamo_db.addDebate(data);
    res.send(JSON.stringify(debate));
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .send("Sorry can't find that! Issue with POST /debate/create");
  }
});

router.post("/debate/edit", async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.id ||
      !data.title ||
      !data.description ||
      !data.debate_status ||
      !data.voting_status
    ) {
      res.json({
        status: "error",
        msg: "Missing all required POST vars"
      });
      res.end();
    }

    data.timestamp = new Date().getTime();

    const debate = await dynamo_db.editDebate(data);
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
