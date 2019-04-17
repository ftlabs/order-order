const express = require("express");
const router = express.Router();
const s3o = require("@financial-times/s3o-middleware");
const path = require("path");
const api_routes = require("../routes/api");
const admin_routes = require("../routes/admin");
const listing = require("../helpers/listings");
const dynamo_db = require("../models/dynamo_db");

router.use("/api", api_routes);
router.use(s3o);
router.use("/admin", admin_routes);

router.get("/", async (req, res) => {
  const username =
    req.cookies.s3o_username !== undefined ? req.cookies.s3o_username : null;
  try {
    let debateList = await dynamo_db.getAllDebateLists();
    res.render("list", {
      pageTitle: "Debates: All",
      pageSubtitle: "List of all debates",
      pageType: "home",
      debateList: debateList,
      user: {
        username: username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/type/:debateType", async (req, res) => {
  try {
    const { debateType } = req.params;
    let debateList = await dynamo_db.getDebateList(debateType);
    res.render("list", {
      pageTitle: `Debates: ${debateType}`,
      pageSubtitle: `List of all ${debateType} type debates`,
      pageType: "home",
      debateList: debateList,
      user: {
        username: req.cookies.s3o_username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get("/:debateType/:debateName/:seriesId?", async (req, res) => {
  try {
    const { debateName } = req.params;
    const seriesId = req.params.seriesId ? req.params.seriesId : 1;

    const result = await dynamo_db.getById(debateName, seriesId);
    const starterTemp = result["Item"].starter;
    result["Item"].starter = [];

    starterTemp.forEach(starter => {
      result["Item"].starter[starter.type] = starter.text;
    });

    const data = {
      debate: result["Item"],
      user: {
        username: req.cookies.s3o_username
      }
    };

    const moduleType = require(path.resolve(
      `${listing.getRootDir()}/modules/${data.debate.debateType}`
    ));

    moduleType.display(req, res, data);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
