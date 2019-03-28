const express = require("express");
const router = express.Router();

router.post("/create_new_debate", (req, res) => {
  try {
    const data = req.body;
    const user = req.cookies.s3o_username;

    console.log(data);
    console.log(user);

    // TODO: add submission to data storage

    res.json({
      status: "ok"
    });
  } catch (err) {
    res.status(404).send("Sorry can't find that!");
  }
});

// TODO: add any other required api calls

module.exports = router;
