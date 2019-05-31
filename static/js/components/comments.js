/* eslint-env browser */

function replyToComment(commentId) {
	var replyTo = document.querySelector('.comment-reply-to');
	var commentReplyNotification = document.querySelector(
		'.comment-reply-notification'
	);
	var commentReplyMessage = document.querySelector('.comment-reply-message');

	replyTo.setAttribute('value', commentId);
	commentReplyNotification.classList.remove('hide');
	commentReplyMessage.innerHTML = 'Replying to comment ' + commentId;
}

function removeReplyToComment() {
	showCommentTypes();
	showVotes();
	var replyTo = document.querySelector('.comment-reply-to');
	var commentReplyNotification = document.querySelector(
		'.comment-reply-notification'
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
			hideVotes();
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
				element.getAttribute('data-debate-type'),
				element.getAttribute('data-index'),
				element.getAttribute('data-rating')
			);
			location.reload();
		});
	});

	var ratingRemoveLinks = document.querySelectorAll('.rate-remove');

	Array.from(ratingRemoveLinks).forEach(function(element) {
		element.addEventListener('click', function(e) {
			removeRatingComment(
				element.getAttribute('data-debate-id'),
				element.getAttribute('data-index'),
				element.getAttribute('data-username')
			);
			location.reload();
		});
	});
}

function rateComment(debateId, debateType, index, rating) {
	const data = {
		index: index,
		rating: rating
	};

	fetch(`rating/${debateType}/${debateId}?`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).catch(function(res) {
		console.log(res);
	});
}

function removeRatingComment(debateId, index, username) {
	const data = {
		index: index,
		username: username
	};

	fetch(`rating/remove/${debateId}?`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).catch(function(res) {
		console.log(res);
	});
}

function initComments() {
	addReplyEventListeners();
	addRatingsEventListeners();
	showVotes();
}

function hideCommentTypes() {
	var commentTypes = document.querySelector('.comment-types');
	commentTypes.classList.add('hide');
}

function showCommentTypes() {
	var commentTypes = document.querySelector('.comment-types');
	commentTypes.classList.remove('hide');
}

function hideVotes() {
	var voteContainer = document.querySelector('.form-voting-container');
	var commentContainer = document.querySelector('.form-comment-container');
	if (voteContainer) {
		voteContainer.classList.add('hide');
		commentContainer.classList.remove('hide');
	}
}

function showVotes() {
	var voteContainer = document.querySelector('.form-voting-container');
	var commentContainer = document.querySelector('.form-comment-container');
	if (voteContainer) {
		voteContainer.classList.remove('hide');
		commentContainer.classList.add('hide');
	}
}

document.addEventListener('DOMContentLoaded', initComments);
