const comments = require('../helpers/comments');

function display(req, res, data) {
  const params = {
    commentsData: data.comments,
  };
  const newData = data;
  newData.commentsStructured = comments.getNestedComments(params).data;
  res.render(data.type, newData);
}

module.exports = { display };
