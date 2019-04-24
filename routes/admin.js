const express = require("express");
const router = express.Router();
const dynamo_db = require("../models/dynamo_db");

router.get("/", async (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  try {
    let debateList = await dynamo_db.getAllDebateLists();
    res.render("admin/index", {
      username: username,
      debateList: debateList,
      page: "dashboard"
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/create_debate", (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  res.render("admin/create_debate", {
    username: username,
    page: "create"
  });
});

router.get("/edit_debate/:debate_uuid", async (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  try {
    const debate = await dynamo_db.getById(req.params.debate_uuid);

    if (!debate) {
      res.status(404).send("Sorry no debate with that id");
    }

    res.render("admin/edit_debate", {
      username: username,
      debate: debate.Items[0],
      page: "edit"
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/moderation", async (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  try {
    const reports = await dynamo_db.getAllReports();

    res.render("admin/moderation", {
      username: username,
      reports: reports,
      page: "moderation"
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
