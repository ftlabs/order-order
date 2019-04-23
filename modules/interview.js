function display(req, res, data) {
  const debate = data.debate;

  console.log(debate);

  res.render(debate.debateType, {
    title: debate.starter.title,
    description: debate.starter.description,
    user: data.user
  });
}

module.exports = { display };
