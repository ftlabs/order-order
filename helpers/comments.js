"use strict";

function getNestedComments(originParams) {
  const defaultParams = {
    commentsData: [],
    paginationStart: null,
    paginationEnd: null,
    paginationRange: null,
    filterTag: null
  };
  const params = Object.assign(defaultParams, originParams);
  const commentsNested = [],
    commentsOrigin = [],
    commentsReplies = [];

  params.commentsData.map(comment => {
    if (comment.replyto === 0) {
      commentsOrigin.push(comment);
    } else {
      commentsReplies.push(comment);
    }
  });

  commentsOrigin.map(comment => {
    comment.replies = getCommentReplies(comment, commentsReplies);
    commentsNested.push(comment);
  });

  if (
    params.paginationStart !== null ||
    params.paginationEnd !== null ||
    params.paginationRange !== null
  ) {
    //paginate results
  }

  if (params.filterTag !== null) {
    //filter results
  }

  return {
    status: "ok",
    data: commentsNested
  };
}

function getCommentReplies(comment, commentsReplies) {
  let replies = [];

  commentsReplies.map(c => {
    if (c.replyto === comment.id) {
      c.replies = getCommentReplies(c, commentsReplies);
      replies.push(c);
    }
  });

  return replies;
}

module.exports = {
  getNestedComments
};
