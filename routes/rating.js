const express = require('express');
const router = express.Router();
const dynamoDb = require('../models/dynamoDb');

router.post('/:debateId', async (req, res) => {
  try {
    const backURL = req.header('Referer') || '/';
    const { debateId } = req.params;
    const { rating, index } = req.body;
    const data = {
      ratings: [
        dynamoDb.constructRatingObject({
          rating,
          index,
          user: req.cookies.s3o_username,
        }),
      ],
    };
    if (await invalidPost(debateId, req.cookies.s3o_username, index)) {
      throw new Error('Something went wrong with the rating');
    }
    await dynamoDb.updateDebate(debateId, data);
    res.redirect(backURL);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

async function invalidPost(debateId, username, index) {
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

module.exports = router;
