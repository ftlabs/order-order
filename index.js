const dotenv = require("dotenv").config({
  silent: process.env.NODE_ENVIRONMENT === "production"
});

const express = require("express");
const path = require("path");
const app = express();

// view engine setup
var hbs = require("express-hbs");

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials"
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use("/static", express.static(path.resolve(__dirname + "/static")));

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
