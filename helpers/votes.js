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

module.exports = {
  hasVoted,
};
