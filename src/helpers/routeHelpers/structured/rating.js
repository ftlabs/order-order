const dynamoDb = require('../../../models/dynamoDb');

async function post({ debateId, username, index }) {
  try {
    await postValidation(debateId, username, index);
  } catch (err) {
    throw err;
  }
}

async function postValidation(debateId, username, index) {
  const debateData = await dynamoDb.getById(debateId);
  const commentData = debateData.Items[0].comments[index];
  if (commentData.ratings.find(rating => rating.user === username)) {
    throw new Error('User has already rated this post');
  }
}

module.exports = {
  post,
};
