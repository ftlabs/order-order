function render(req, res, data) {
  data.commentsStructured = nestComments(data.comments);
  res.render(data.type, data);
}

function nestComments(commentsData) {
  const newComments = [];

  commentsData.map(comment => {
    if (comment.replyto === 0) {
      comment.replies = findReplies(comment, commentsData);
      newComments.push(comment);
    }
  });

  return newComments;
}

function findReplies(comment, commentsData) {
  let replies = [];

  commentsData.map(c => {
    if (c.replyto === comment.id) {
      c.replies = findReplies(c, commentsData);
      replies.push(c);
    }
  });

  return replies;
}

module.exports = { render };
