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
    const debateData = await dynamoDb.getById(debateId);
    const commentData = debateData.Items[0].comments[index];
    if (
      commentData.ratings.find(
        rating => rating.user === req.cookies.s3o_username,
      )
    ) {
      throw new Error('You have already rated this comment');
    }
    const result = await dynamoDb.updateDebate(debateId, data);
    res.redirect(backURL);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
