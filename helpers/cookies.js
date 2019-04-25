function getProperty(cookie, name) {
  if (Object.prototype.hasOwnProperty.call(cookie, name)) {
    const username = cookie[name];
    if (username) {
      return username;
    }
  }
  return null;
}

module.exports = {
  getProperty,
};
