function render(req, res, data) {
  res.render(data.type);
}

module.exports = { render };
