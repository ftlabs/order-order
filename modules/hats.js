function render(req, res, data) {
  data.comments = nestComments(data.comments);
  res.render(data.type, data);
}

function nestComments(commentsData) {
  const newComments = [];

  //get origin comments
  commentsData.map(comment => {
    if (comment.replyto === 0) {
      newComments.push(comment);
    }
  });

  return newComments;
}

module.exports = { render };
