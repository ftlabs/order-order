const dotenv = require("dotenv").config({
  silent: process.env.NODE_ENVIRONMENT === "production"
});

const express = require("express");
var exphbs = require("express-handlebars");
const path = require("path");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("ERROR: PORT not specified in env");
}

app.get("/:type/:name", (req, res) => {
  const { name, type } = req.params;
  const data = require(`./dummyData/${type}/${name}.json`);
  const moduleType = require(`./modules/${type}`);
  moduleType.render(req, res, data);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
