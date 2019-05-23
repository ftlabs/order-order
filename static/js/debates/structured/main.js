/* eslint-env browser */

/* eslint-env browser */

function replyToComment(commentId) {
  var replyTo = document.querySelector('.comment-reply-to');
  var commentReplyNotification = document.querySelector(
    '.comment-reply-notification',
  );
  var commentReplyMessage = document.querySelector('.comment-reply-message');

  replyTo.setAttribute('value', commentId);
  commentReplyNotification.classList.remove('hidden');
  commentReplyMessage.innerHTML = 'Replying to comment ' + commentId;
}

function removeReplyToComment() {
  var replyTo = document.querySelector('.comment-reply-to');
  var commentReplyNotification = document.querySelector(
    '.comment-reply-notification',
  );
  commentReplyNotification.classList.add('hidden');
  replyTo.removeAttribute('value');
}

function addReplyEventListeners() {
  var replyLinks = document.querySelectorAll('.reply');
  var commentReplyRemove = document.querySelector('.comment-reply-remove');

  Array.from(replyLinks).forEach(element =>
    element.addEventListener('click', () =>
      replyToComment(element.getAttribute('data-comment-id')),
    ),
  );

  commentReplyRemove.addEventListener('click', removeReplyToComment);
}

function init() {
  addReplyEventListeners();
}

document.addEventListener('DOMContentLoaded', init);
