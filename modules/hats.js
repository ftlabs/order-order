const commentHelper = require('../helpers/comments');

function display(req, res, data) {
	const { debate } = data;

	if (debate.comments) {
		const params = {
			commentsData: debate.comments
		};
		debate.commentsStructured = commentHelper.getNestedComments(
			params
		).data;
	}

	res.render(`debates/${debate.debateType}`, data);
}

module.exports = { display };
