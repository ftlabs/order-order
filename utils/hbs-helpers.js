"use strict";

function registerHelpers(hbs) {
  hbs.registerHelper("ifEquals", ifEquals);
}

function ifEquals(arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
}

module.exports = {
  registerHelpers
};
