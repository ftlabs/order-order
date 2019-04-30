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
    user,
  } = data.debate;

  if (comments) {
    const commentsWithIndex = comments.map((comment, index) => ({
      ...comment,
      index,
    }));
    commentsFor = commentsWithIndex.filter(comment =>
      comment.tags.includes('for'),
    );
    commentsAgainst = commentsWithIndex.filter(comment =>
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
    debateId: id,
    user,
  });
}

module.exports = { display };
