const Utils = require('../helpers/utils');

function getCommentReplies(originComment, commentsReplies) {
	const replies = [];

	commentsReplies.forEach((comment) => {
		if (comment.replyTo === originComment.id) {
			const newComment = comment;
			newComment.formatDate = Utils.formatDate(comment.createdAt);
			newComment.replies = getCommentReplies(newComment, commentsReplies);
			replies.push(newComment);
		}
	});

	return replies;
}

function getNestedComments(originParams, username) {
	const defaultParams = {
		commentsDataRaw: [],
		commentsDataFiltered: [],
		paginationStart: null,
		paginationEnd: null,
		paginationRange: null,
		filterTag: null
	};
	const params = Object.assign(defaultParams, originParams);
	const commentsNested = [];
	const commentsOrigin = [];
	const commentsReplies = [];

	params.commentsDataFiltered.forEach((comment) => {
		const { upVotes, upVoters, userRatingId } = getUpVotes(
			comment,
			username
		);
		comment.upVotes = upVotes;
		comment.upVoters = upVoters;
		comment.userRatingId = userRatingId;

		comment.usernameNice = Utils.cleanUsername(comment.user);
		if (!Utils.hasOwnPropertyCall(comment, 'replyTo')) {
			commentsOrigin.push(comment);
		} else {
			commentsReplies.push(comment);
		}
	});

	commentsOrigin.forEach((comment) => {
		const newComment = comment;
		newComment.formatDate = Utils.formatDate(comment.createdAt);
		newComment.replies = getCommentReplies(
			newComment,
			params.commentsDataRaw
		);
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

function getAndNestComments(comments, username) {
	let commentsFor = [];
	let commentsAgainst = [];

	if (comments) {
		const commentsWithIndex = comments.map((comment, index) => ({
			...comment,
			index
		}));
		commentsFor = commentsWithIndex.filter((comment) => {
			if (comment.tags.includes('for')) {
				return comment;
			}
		});
		commentsAgainst = commentsWithIndex.filter((comment) => {
			if (comment.tags.includes('against')) {
				return comment;
			}
		});

		// adds nesting structure
		commentsFor = getNestedComments(
			{
				commentsDataRaw: commentsWithIndex,
				commentsDataFiltered: commentsFor
			},
			username
		);

		commentsAgainst = getNestedComments(
			{
				commentsDataRaw: commentsWithIndex,
				commentsDataFiltered: commentsAgainst
			},
			username
		);
	}

	return {
		commentsFor,
		commentsAgainst
	};
}

function getUpVotes(comment, username) {
	let upVotes = 0;
	let upVoters = [];
	let userRatingId;
	if (comment && comment.ratings) {
		comment.ratings.forEach((rating) => {
			if (rating.rating === 'upvote') {
				upVotes = upVotes + 1;
				upVoters.push(rating.user);
				if (rating.user === username) {
					userRatingId = rating.id;
				}
			}
		});
	}

	let result = { upVotes, upVoters };
	if (userRatingId) {
		result = { ...result, userRatingId };
	}
	return result;
}

module.exports = {
	getAndNestComments
};
