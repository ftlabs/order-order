import commentHelper from '../helpers/comments';
import votesHelper from '../helpers/votes';

function display(req, res, data) {
  const { debate, user } = data;
  const {
    id,
    title,
    description,
    debateStatus,
    votingStatus,
    debateType,
    comments,
    debateRatings,
  } = debate;

  const { commentsFor, commentsAgainst } = commentHelper.getAndNestComments(
    comments,
  );
  const debateOpen = debateStatus === 'open' ? true : false;
  const votingOpen = votingStatus === 'open' ? true : false;
  const voteOptions = ['for', 'against'];
  const voteFromRatings = votesHelper.voteFromRatings(
    debateRatings,
    voteOptions,
  );
  const existingVote = votesHelper.hasVoted(voteFromRatings, user.username);
  const voteResults = votesHelper.calculateResults(
    voteFromRatings,
    voteOptions,
  );

  res.render(`debates/${debateType}`, {
    title,
    description,
    debateOpen,
    votingOpen,
    existingVote,
    voteOptions,
    voteResults,
    debateType,
    commentsFor,
    commentsAgainst,
    debateId: id,
    user,
  });
}

export default { display };
