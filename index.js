const dotenv = require("dotenv").config({
  silent: process.env.NODE_ENVIRONMENT === "production"
});

const express = require("express");
const path = require("path");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("ERROR: PORT not specified in env");
}

app.get("/:type/:name", (req, res) => {
  const data = require(`./${type}/${name}.json`);
  console.log(data);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

function apply(req, res) {}
