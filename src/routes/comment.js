import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';
import dynamoDb from '../models/dynamoDb';

router.post('/:debateType/:debateId', async (req, res) => {
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
    console.error(err);
    res.status(404).send("Sorry can't find that!");
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

export default router;
