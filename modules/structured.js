function display(req, res, data) {
  let commentsFor = [];
  let commentsAgainst = [];
  const {
    comments,
    title,
    description,
    debateType,
    debateStatus,
    id,
  } = data.debate;

  if (comments) {
    commentsFor = comments.filter(comment => comment.tags.includes('for'));
    commentsAgainst = comments.filter(comment =>
      comment.tags.includes('against'),
    );
  }

  const debateOpen = debateStatus === 'open';

  res.render(debateType, {
    title,
    description,
    debateOpen,
    commentsFor,
    commentsAgainst,
    id,
    user: data.user,
  });
}

module.exports = { display };
