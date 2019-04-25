function display(req, res, data) {
  let commentsFor = [];
  let commentsAgainst = [];
  const { debate } = data;

  if (debate.comments) {
    commentsFor = debate.comments.filter(comment => {
      comment.tags.includes('for');
      return comment;
    });
    commentsAgainst = debate.comments.filter(comment => {
      comment.tags.includes('against');
      return comment;
    });
  }

  const debateOpen = debateStatus === 'open';

  res.render(debateType, {
    title,
    description,
    debateOpen,
    commentsFor,
    commentsAgainst,
    user: data.user,
  });
}

module.exports = { display };
