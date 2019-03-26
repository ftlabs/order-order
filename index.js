const dotenv = require("dotenv").config({
  silent: process.env.NODE_ENVIRONMENT === "production"
});

const express = require("express");
const path = require("path");
const app = express();
const admin = require("./routes/admin");

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

app.use("/admin/", admin);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/:debateType/:debateName", (req, res) => {
  try {
    const { debateName, debateType } = req.params;
    const data = require(`./dummyData/${debateType}/${debateName}.json`);
    const moduleType = require(`./modules/${debateType}`);
    moduleType.render(req, res, data);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
