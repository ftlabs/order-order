const comments = require("../helpers/comments");

function display(req, res, data) {
  const debate = data.debate;

  if (debate.comments) {
    const params = {
      commentsData: debate.comments
    };
    debate.commentsStructured = comments.getNestedComments(params).data;
  }

  res.render(debate.debateType, data);
}

module.exports = { display };
