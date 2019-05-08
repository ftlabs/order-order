function hasVoted(votes, username) {
  let voted = '';
  if (votes) {
    votes.forEach(vote => {
      if (vote.user === username) {
        voted = vote.content[0];
      }
    });
  }
  return voted;
}

function calculateResults(votes, options) {
  let voteCalculations = [];
  let voteResults = [];
  let voteTotal = 0;

  options.forEach(opt => {
    voteCalculations[opt] = {
      name: opt,
      number: 0,
      percentage: 0,
    };
  });

  votes.forEach(vote => {
    if (options.includes(vote.content[0])) {
      voteTotal = voteTotal + 1;
      voteCalculations[vote.content[0]].number =
        voteCalculations[vote.content[0]].number + 1;
      voteCalculations[vote.content[0]].percentage =
        (voteCalculations[vote.content[0]].number / voteTotal) * 100;
    }
  });

  options.forEach(opt => {
    voteResults.push(voteCalculations[opt]);
  });
  return voteResults;
}

module.exports = {
  hasVoted,
  calculateResults,
};
