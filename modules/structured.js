const commentHelper = require('../helpers/comments');

function display(req, res, data) {
  let commentsFor = [];
  let commentsAgainst = [];
  const { debate, user } = data;
  const { id, title, description, debateStatus, debateType } = debate;

  if (debate.comments) {
    commentsFor = debate.comments.filter(comment => {
      if (comment.tags.includes('for')) {
        return comment;
      }
    });
    commentsAgainst = debate.comments.filter(comment => {
      if (comment.tags.includes('against')) {
        return comment;
      }
    });
  }

  debateOpen = debateStatus === 'open' ? true : false;

  commentsForStructured = commentHelper.getNestedComments({
    commentsData: commentsFor,
  }).data;

  commentsAgainstStructured = commentHelper.getNestedComments({
    commentsData: commentsAgainst,
  }).data;

  res.render(debateType, {
    id,
    title,
    description,
    debateOpen,
    commentsForStructured,
    commentsAgainstStructured,
    user,
  });
}

module.exports = { display };
