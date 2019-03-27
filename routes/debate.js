const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:debateType/:debateName", (req, res) => {
  try {
    const { debateName, debateType } = req.params;
    const data = require(path.resolve(
      __basedir + `/dummyData/${debateType}/${debateName}.json`
    ));
    const moduleType = require(path.resolve(
      __basedir + `/modules/${debateType}`
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
