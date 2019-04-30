const express = require('express');
const router = express.Router();
const dynamoDb = require('../models/dynamoDb');

router.post('/:debateId', async (req, res) => {
  try {
    const backURL = req.header('Referer') || '/';
    const { debateId } = req.params;
    const { comment, tags, displayStatus, replyTo } = req.body;
    const data = {
      comments: [
        dynamoDb.constructCommentObject({
          content: comment,
          user: req.cookies.s3o_username,
          tags,
          replyTo,
          displayStatus,
        }),
      ],
    };
    await dynamoDb.updateDebate(debateId, data);
    res.redirect(backURL);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
