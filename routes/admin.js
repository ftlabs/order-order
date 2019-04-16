const express = require("express");
const router = express.Router();
const listing = require("../helpers/listings.js");
const dynamo_db = require("../models/dynamo_db");

router.get("/", (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  try {
    res.render("admin/index", {
      username: username,
      debateList: dynamo_db.getAllDebateLists()
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/create_debate", (req, res) => {
  res.render("admin/create_debate");
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
