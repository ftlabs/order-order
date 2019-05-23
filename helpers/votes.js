function voteFromRatings(ratings, voteOptions) {
	let votes = [];
	if (ratings) {
		ratings.forEach((rating) => {
			if (voteOptions.includes(rating.rating)) {
				votes.push(rating);
			}
		});
	}
	return votes;
}

function hasVoted(votes, username) {
	let voted = '';
	if (votes) {
		votes.forEach((vote) => {
			if (vote.user === username) {
				voted = vote.rating;
			}
		});
	}
	return voted;
}

function calculateResults(votes, voteOptions) {
	let voteCalculations = [];
	let voteResults = [];
	let voteTotal = 0;

	voteOptions.forEach((opt) => {
		voteCalculations[opt] = {
			name: opt,
			number: 0,
			percentage: 0
		};
	});

	votes.forEach((vote) => {
		if (voteOptions.includes(vote.rating)) {
			voteTotal = voteTotal + 1;
			voteCalculations[vote.rating].number =
				voteCalculations[vote.rating].number + 1;
			voteCalculations[vote.rating].percentage =
				(voteCalculations[vote.rating].number / voteTotal) * 100;
		}
	});

	voteOptions.forEach((opt) => {
		voteResults.push(voteCalculations[opt]);
	});
	return voteResults;
}

module.exports = {
	voteFromRatings,
	hasVoted,
	calculateResults
};
