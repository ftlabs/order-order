/* eslint-env browser */

function activateVotingOptions() {
	const submitBtn = document.getElementById('submit_new_debate_vote');
	submitBtn.disabled = false;
}

function addVotingEventListeners() {
	const votingOptions = document.getElementsByClassName('vote-option');

	Array.from(votingOptions).forEach(function(element) {
		document.addEventListener('change', activateVotingOptions);
	});
}

function initVoting() {
	addVotingEventListeners();
}

document.addEventListener('DOMContentLoaded', initVoting);
