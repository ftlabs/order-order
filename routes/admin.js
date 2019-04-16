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
      debateList: debateList
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/create_debate", (req, res) => {
  res.render("admin/create_debate");
});

router.get("/edit_debate", async (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  try {
    let debateList = await dynamo_db.getAllDebateLists();
    res.render("admin/edit_debate", {
      username: username,
      debateList: debateList
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/moderation", (req, res) => {
  res.render("admin/moderation");
});

router.get("/users", (req, res) => {
  res.render("admin/users");
});

router.get("/messages", (req, res) => {
  res.render("admin/messages");
});

module.exports = router;
