function display(req, res, data) {
  let commentsFor = [];
  let commentsAgainst = [];
  const debate = data.debate;

  console.log(debate);

  if (debate.comments) {
    commentsFor = debate.comments.filter(comment =>
      comment.tags.includes("for")
    );
    commentsAgainst = debate.comments.filter(comment =>
      comment.tags.includes("against")
    );
  }

  res.render(debate.debateType, {
    title: debate.title,
    description: debate.description,
    commentsFor,
    commentsAgainst,
    user: data.user
  });
}

module.exports = { display };
