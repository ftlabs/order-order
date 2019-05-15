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

function addRatingsEventListeners() {
  const ratingLinks = document.querySelectorAll('.rate');

  Array.from(ratingLinks).forEach(function(element) {
    element.addEventListener('click', function(e) {
      rateComment(
        element.getAttribute('data-debate-id'),
        element.getAttribute('data-index'),
        element.getAttribute('data-rating'),
      );
    });
  });
}

function rateComment(debateId, index, rating) {
  var formData = new FormData();
  formData.append('index', index);
  formData.append('rating', rating);

  fetch(`rating/${debateId}?`, {
    method: 'POST',
    body: formData,
  })
    .then(function(res) {
      console.log(res);
    })
    .catch(function(res) {
      console.log(res);
    });
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
