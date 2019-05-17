/* eslint-env browser */

function replyToComment(commentId) {
  var replyTo = document.querySelector('.comment-reply-to');
  var commentReplyNotification = document.querySelector(
    '.comment-reply-notification',
  );
  var commentReplyMessage = document.querySelector('.comment-reply-message');

  replyTo.setAttribute('value', commentId);
  commentReplyNotification.classList.remove('hide');
  commentReplyMessage.innerHTML = 'Replying to comment ' + commentId;
}

function removeReplyToComment() {
  showCommentTypes();
  var replyTo = document.querySelector('.comment-reply-to');
  var commentReplyNotification = document.querySelector(
    '.comment-reply-notification',
  );
  commentReplyNotification.classList.add('hide');
  replyTo.removeAttribute('value');
}

function addReplyEventListeners() {
  var replyLinks = document.querySelectorAll('.reply');
  var commentReplyRemove = document.querySelector('.comment-reply-remove');

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
  var ratingLinks = document.querySelectorAll('.rate');

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
  var commentTypes = document.querySelector('.comment-types');
  commentTypes.classList.add('hide');
}

function showCommentTypes() {
  var commentTypes = document.querySelector('.comment-types');
  commentTypes.classList.remove('hide');
}

document.addEventListener('DOMContentLoaded', initComments);
