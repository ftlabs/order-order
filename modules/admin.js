const comments = require("../helpers/comments");

function render(req, res, data) {
  const params = {
    commentsData: data.comments
  };
  data.commentsStructured = comments.getNestedComments(params).data;
  res.render(data.type, data);
}

module.exports = { render };
