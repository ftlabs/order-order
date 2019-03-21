const dotenv = require("dotenv").config({
  silent: process.env.NODE_ENVIRONMENT === "production"
});

const express = require("express");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
