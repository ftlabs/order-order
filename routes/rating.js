const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dynamoDb = require('../models/dynamoDb');

router.post('/:debateType/:debateId', async (req, res) => {
  try {
    const backURL = req.header('Referer') || '/';
    const { debateId, debateType } = req.params;
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
    await customLogic({
      functionName: 'post',
      username: req.cookies.s3o_username,
      debateId,
      index,
      debateType,
    });
    await dynamoDb.updateDebate(debateId, data);
    res.redirect(backURL);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

async function customLogic({
  functionName,
  debateId,
  index,
  debateType,
  username,
}) {
  const helperFilePath = path.resolve(
    `./helpers/routeHelpers/${debateType}/rating.js`,
  );
  if (fs.existsSync(helperFilePath)) {
    const debateTypeHelper = require(helperFilePath);
    await debateTypeHelper[functionName]({
      debateId,
      index,
      username,
    });
  }
}

module.exports = router;
