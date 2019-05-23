const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dynamoDb = require('../models/dynamoDb');

router.post('/:debateType/:debateId', async (req, res, next) => {
  try {
    const backURL = req.header('Referer') || '/';
    const { debateId, debateType } = req.params;
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
    await customLogic({ functionName: 'post', debateType });
    await dynamoDb.updateDebate(debateId, data);
    res.redirect(backURL);
  } catch (err) {
    next(err);
  }
});

async function customLogic({ functionName, debateType }) {
  const helperFilePath = path.resolve(
    `./helpers/routeHelpers/${debateType}/comment.js`,
  );
  if (fs.existsSync(helperFilePath)) {
    const debateTypeHelper = require(helperFilePath);
    await debateTypeHelper[functionName]({});
  }
}

module.exports = router;
