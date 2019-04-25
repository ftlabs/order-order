function getCommentReplies(comment, commentsReplies) {
  const replies = [];

  commentsReplies.map(c => {
    if (c.replyto === comment.id) {
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
    if (comment.replyto === 0) {
      commentsOrigin.push(comment);
    } else {
      commentsReplies.push(comment);
    }
  });

  commentsOrigin.forEach(comment => {
    const newComment = comment;
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

  return {
    status: 'ok',
    data: commentsNested,
  };
}

module.exports = {
  getNestedComments,
};
