const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

// List of all debates
router.get("/", (req, res) => {
  try {
    res.render("list", {
      pageTitle: "Debates: All",
      pageSubtitle: "List of all debates",
      pageType: "home",
      debateList: getDebateListings(),
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
      debateList: getDebateListings(debateType),
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

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(path => {
      let arr = path.split("/");
      return {
        type: arr[arr.length - 1],
        path: path
      };
    });

function getDebateListings(searchedType = "") {
  const directoryList = getDirectories(__basedir + `/dummyData/`);
  directoryList.forEach(debateType => {
    if (debateType.type === searchedType || searchedType === "") {
      debateType.debateTypeName = debateType.type;
      debateType.debates = [];

      const files = fs.readdirSync(debateType.path);
      files.forEach(file => {
        if (file.endsWith(".json")) {
          debateType.debates.push(file.replace(".json", ""));
        }
      });
    }
  });

  return directoryList;
}

module.exports = router;
