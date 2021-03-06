function display(req, res, data) {
	const { debate } = data;

	res.render(`debates/${debate.debateType}`, {
		title: debate.title,
		description: debate.description,
		user: data.user
	});
}

module.exports = { display };
