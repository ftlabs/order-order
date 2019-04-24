function display(req, res, data) {
  const debate = data.debate;

  res.render(debate.debateType, {
    title: debate.title,
    description: debate.description,
    user: data.user
  });
}

module.exports = { display };
