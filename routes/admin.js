const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/create_new_debate", (req, res) => {
  res.render("admin/create_new_debate");
});

router.get("/moderation", (req, res) => {
  res.render("admin/moderation");
});

module.exports = router;
