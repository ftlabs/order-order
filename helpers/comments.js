const Utils = require('../helpers/utils');

function getCommentReplies(comment, commentsReplies) {
  const replies = [];

  commentsReplies.map(c => {
    if (c.replyTo === comment.id) {
      const newComment = c;
      newComment.replies = getCommentReplies(newComment, commentsReplies);
      replies.push(newComment);
    }
    return true;
  });

  return replies;
}

function getNestedComments(originParams) {
  const defaultParams = {
    commentsData: [],
    paginationStart: null,
    paginationEnd: null,
    paginationRange: null,
    filterTag: null,
  };
  const params = Object.assign(defaultParams, originParams);
  const commentsNested = [];
  const commentsOrigin = [];
  const commentsReplies = [];

  params.commentsData.forEach(comment => {
    if (!Object.prototype.hasOwnProperty.call(comment, 'replyTo')) {
      commentsOrigin.push(comment);
    } else {
      commentsReplies.push(comment);
    }
  });

  commentsOrigin.forEach(comment => {
    const newComment = comment;
    newComment.formatDate = Utils.formatDate(comment.createdAt);
    newComment.replies = getCommentReplies(newComment, commentsReplies);
    commentsNested.push(newComment);
  });

  if (
    params.paginationStart !== null ||
    params.paginationEnd !== null ||
    params.paginationRange !== null
  ) {
    // paginate results
  }

  if (params.filterTag !== null) {
    // filter results
  }

  return commentsNested;
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
    commentsFor = getNestedComments({
      commentsData: commentsFor,
    });

    commentsAgainst = getNestedComments({
      commentsData: commentsAgainst,
    });
  }

  return {
    commentsFor,
    commentsAgainst,
  };
}

module.exports = {
  getAndNestComments,
};
