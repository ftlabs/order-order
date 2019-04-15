const express = require("express");
const router = express.Router();
const api_routes = require("../routes/api");
const admin_routes = require("../routes/admin");
const debate_routes = require("../routes/debate");
const listing = require("../helpers/listings.js");

// List of all debates
router.get("/", (req, res) => {
  try {
    res.render("list", {
      pageTitle: "Debates: All",
      pageSubtitle: "List of all debates",
      pageType: "home",
      debateList: listing.getDebateListings("dummyData"),
      user: {
        username: req.cookies.s3o_username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.use("/api", api_routes);
router.use("/debates", debate_routes);
router.use("/admin", admin_routes);

module.exports = router;
