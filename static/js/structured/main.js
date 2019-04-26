function replyToComment(commentId) {
  const commentForm = document.querySelector('.comment-form');
  const commentReplyNotification = document.querySelector(
    '.comment-reply-notification',
  );

  const queryString =
    commentForm.getAttribute('action') + 'replyTo=' + commentId;
  commentForm.setAttribute('action', queryString);
  commentReplyNotification.classList.remove('hidden');
  commentReplyNotification.innerHTML = 'Replying to comment ' + commentId;
}

function removeReplyToComment() {}

function init() {
  const replyLinks = document.querySelectorAll('.reply');
  Array.from(replyLinks).forEach(element =>
    element.addEventListener('click', () =>
      replyToComment(element.getAttribute('data-comment-id')),
    ),
  );
}

document.addEventListener('DOMContentLoaded', init);
