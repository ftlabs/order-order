const dotenv = require("dotenv").config({
  silent: process.env.NODE_ENV === "production"
});

const PORT = process.env.PORT || 9090;
const package = require("./package.json");
const debug = require("debug")(`${package.name}:index`);
const s3o = require("@financial-times/s3o-middleware");
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("express-hbs");
const helmet = require("helmet");
const express_enforces_ssl = require("express-enforces-ssl");
const bodyParser = require("body-parser");
const core_routes = require("./routes/router");

if (!PORT) {
  throw new Error("ERROR: PORT not specified in env");
}

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.enable("trust proxy");
  app.use(express_enforces_ssl());
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine(
  "hbs",
  hbs.express4({
    partialsDir: __dirname + "/views/partials"
  })
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

let requestLogger = function(req, res, next) {
  debug("RECEIVED REQUEST:", req.method, req.url);
  next();
};

app.use(express.json());

app.use(requestLogger);
app.use("/static", express.static(path.resolve(__dirname + "/static")));
app.use(s3o);
app.use("/", core_routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
