const dynamoDb = require('../../../models/dynamoDb');

async function post({ debateId, username, index }) {
  if (await postValidation(debateId, username, index)) {
    throw new Error('Rating is not valid');
  }
}

async function postValidation(debateId, username, index) {
  try {
    const debateData = await dynamoDb.getById(debateId);
    const commentData = debateData.Items[0].comments[index];
    if (commentData.ratings.find(rating => rating.user === username)) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return true;
  }
}

module.exports = {
  postValidation,
};
