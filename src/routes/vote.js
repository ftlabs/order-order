import express from 'express';
const router = express.Router();
import dynamoDb from '../models/dynamoDb';

router.post('/:debateId', async (req, res) => {
  try {
    const backURL = req.header('Referer') || '/';
    const { debateId } = req.params;
    const { tags } = req.body;
    const data = {
      debateRatings: [
        dynamoDb.constructRatingObject({
          rating: tags[0],
          user: req.cookies.s3o_username,
          index: debateId,
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

export default router;
