const express = require("express");
const router = express.Router();
const path = require("path");
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

// List of all debates of a specific type
router.get("/:debateType", (req, res) => {
  try {
    const { debateType } = req.params;

    res.render("list", {
      pageTitle: `Debates: ${debateType}`,
      pageSubtitle: `List of all ${debateType} type debates`,
      pageType: "home",
      debateList: listing.getDebateListings("dummyData", debateType),
      user: {
        username: req.cookies.s3o_username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

// Display a debate of a specific type and name
router.get("/:debateType/:debateName", (req, res) => {
  try {
    const { debateName, debateType } = req.params;
    const data = require(path.resolve(
      `${listing.getRootDir()}/dummyData/${debateType}/${debateName}.json`
    ));
    const moduleType = require(path.resolve(
      `${listing.getRootDir()}/modules/${debateType}`
    ));

    data.user = {
      username: req.cookies.s3o_username
    };

    moduleType.render(req, res, data);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
