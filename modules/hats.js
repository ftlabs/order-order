const comments = require("../helpers/comments");

function render(req, res, data) {
  const params = {
    commentsData: data.comments
  };
  data.commentsStructured = comments.getNestedComments(params).data;

  const user = {
    username: req.cookies.s3o_username
  };

  data.user = user;

  res.render(data.type, data);
}

module.exports = { render };
