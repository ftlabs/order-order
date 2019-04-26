const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1");
const dynamo_db = require("../models/dynamo_db");

router.post("/debate/create", async (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().getTime();

    if (
      !data.debateType ||
      !data.title ||
      !data.description ||
      !data.debateStatus ||
      !data.votingStatus
    ) {
      return res.json({
        status: "error",
        msg: "Missing all required POST vars",
        field: 'global'
      });
    }

    // Check if debate of this name exists already
    const checkDebateName = await dynamo_db.getBy("title", data.title);

    if (checkDebateName.hasOwnProperty("error")) {
      return res.json({
        status: "error",
        msg: checkDebateName.error,
        field: 'title'
      });
    }

    if (checkDebateName.Items.length > 0) {
      return res.json({
        status: "error",
        msg: "A debate with this name exists already",
        field: 'title'
      });
    }

    // Validation complete - create new debate
    data.id = uuidv1();
    data.timestamp = new Date().getTime();
    data.createdAt = timestamp;
    data.updatedAt = timestamp;

    const debate = await dynamo_db.addDebate(data);

    if (debate.hasOwnProperty("error")) {
      return res.json({
        status: "error",
        msg: debate.error,
        field: 'global'
      });
    }

    return res.send(JSON.stringify(debate));
  } catch (err) {
    console.error(err);
    return res
      .status(404)
      .send("Sorry can't find that! Issue with POST /debate/create");
  }
});

router.post("/debate/edit", async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.id ||
      !data.debateType ||
      !data.title ||
      !data.description ||
      !data.debateStatus ||
      !data.votingStatus
    ) {
      return res.json({
        status: "error",
        msg: "Missing all required POST vars",
        field: 'global'
      });
    }

    data.timestamp = new Date().getTime();

    const debate = await dynamo_db.editDebate(data);

    return res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .send("Sorry can't find that! Issue with POST /debate/create");
  }
});

router.get("/debate/types", async (req, res) => {
  try {
    const allDebateTypes = await dynamo_db.getAllTypes();
    return res.send(JSON.stringify(allDebateTypes));
  } catch (err) {
    console.error(err);
    return res.status(404).send("Sorry can't find that! Issue with GET /debate/types");
  }
});

module.exports = router;
