function render(req, res, data) {
  const commentsFor = data.comments.filter(comment =>
    comment.tags.includes("for")
  );
  const commentsAgainst = data.comments.filter(comment =>
    comment.tags.includes("against")
  );

  res.render(data.type, {
    title: data.starter.title,
    description: data.starter.description,
    commentsFor,
    commentsAgainst
  });
}

module.exports = { render };
