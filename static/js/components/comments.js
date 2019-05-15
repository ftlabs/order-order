/* eslint-env browser */

function replyToComment(commentId) {
  const replyTo = document.querySelector('.comment-reply-to');
  const commentReplyNotification = document.querySelector(
    '.comment-reply-notification',
  );
  const commentReplyMessage = document.querySelector('.comment-reply-message');

  replyTo.setAttribute('value', commentId);
  commentReplyNotification.classList.remove('hide');
  commentReplyMessage.innerHTML = 'Replying to comment ' + commentId;
}

function removeReplyToComment() {
  showCommentTypes();
  const replyTo = document.querySelector('.comment-reply-to');
  const commentReplyNotification = document.querySelector(
    '.comment-reply-notification',
  );
  commentReplyNotification.classList.add('hide');
  replyTo.removeAttribute('value');
}

function addReplyEventListeners() {
  const replyLinks = document.querySelectorAll('.reply');
  const commentReplyRemove = document.querySelector('.comment-reply-remove');

  Array.from(replyLinks).forEach(function(element) {
    element.addEventListener('click', function(e) {
      hideCommentTypes();
      replyToComment(element.getAttribute('data-comment-id'));
    });
  });

  if (commentReplyRemove) {
    commentReplyRemove.addEventListener('click', removeReplyToComment);
  }
}

function initComments() {
  addReplyEventListeners();
}

function hideCommentTypes() {
  const commentTypes = document.querySelector('.comment-types');
  commentTypes.classList.add('hide');
}

function showCommentTypes() {
  const commentTypes = document.querySelector('.comment-types');
  commentTypes.classList.remove('hide');
}

document.addEventListener('DOMContentLoaded', initComments);
