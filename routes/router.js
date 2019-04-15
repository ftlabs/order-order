const express = require("express");
const router = express.Router();
const s3o = require("@financial-times/s3o-middleware");
const path = require("path");
const api_routes = require("../routes/api");
const admin_routes = require("../routes/admin");
const listing = require("../helpers/listings.js");

router.use("/api", api_routes);
router.use(s3o);
router.use("/admin", admin_routes);

router.get("/", (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  try {
    res.render("list", {
      pageTitle: "Debates: All",
      pageSubtitle: "List of all debates",
      pageType: "home",
      debateList: listing.getDebateListings("dummyData"),
      user: {
        username: username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/type/:debateType", (req, res) => {
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
