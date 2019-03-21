function render(req, res, data) {
  console.log(data);
  console.log("hello world");
  res.render(data.type);
}

module.exports = { render };
