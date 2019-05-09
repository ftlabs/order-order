const commentHelper = require('../helpers/comments');

function display(req, res, data) {
  const { debate, user } = data;
  const { id, title, description, debateStatus, debateType, comments } = debate;
  const { commentsFor, commentsAgainst } = commentHelper.getAndNestComments(
    comments,
  );
  const debateOpen = debateStatus === 'open' ? true : false;

  res.render(`debates/${debateType}`, {
    title,
    description,
    debateOpen,
    debateType,
    commentsFor,
    commentsAgainst,
    debateId: id,
    user,
  });
}

module.exports = { display };
