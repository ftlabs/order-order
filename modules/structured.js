const commentHelper = require('../helpers/comments');

function display(req, res, data) {
  const { debate, user } = data;
  const { id, title, description, debateStatus, debateType, comments } = debate;
  const { commentsFor, commentsAgainst } = getAndNestComments(comments);
  const debateOpen = debateStatus === 'open' ? true : false;

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

function getAndNestComments(comments) {
  let commentsFor = [];
  let commentsAgainst = [];

  if (comments) {
    const commentsWithIndex = comments.map((comment, index) => ({
      ...comment,
      index,
    }));
    commentsFor = commentsWithIndex.filter(comment => {
      if (comment.tags.includes('for')) {
        return comment;
      }
    });
    commentsAgainst = commentsWithIndex.filter(comment => {
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
    commentsFor,
    commentsAgainst,
  };
}

module.exports = { display };
