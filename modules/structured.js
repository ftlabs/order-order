const commentHelper = require('../helpers/comments');

function display(req, res, data) {
  const { debate, user } = data;
  const { id, title, description, debateStatus, debateType, comments } = debate;
  const { commentsFor, commentsAgainst } = getAndNestComments(comments);

  debateOpen = debateStatus === 'open' ? true : false;

  res.render(debateType, {
    id,
    title,
    description,
    debateOpen,
    commentsFor,
    commentsAgainst,
    user,
  });
}

function getAndNestComments(comments) {
  let commentsFor = [];
  let commentsAgainst = [];

  if (comments) {
    commentsFor = comments.filter(comment => {
      if (comment.tags.includes('for')) {
        return comment;
      }
    });
    commentsAgainst = comments.filter(comment => {
      if (comment.tags.includes('against')) {
        return comment;
      }
    });

    // adds nesting structure
    commentsFor = commentHelper.getNestedComments({
      commentsData: commentsFor,
    });

    commentsAgainst = commentHelper.getNestedComments({
      commentsData: commentsAgainst,
    });
  }

  return {
    commentsFor: commentsFor,
    commentsAgainst: commentsAgainst,
  };
}

module.exports = { display };
