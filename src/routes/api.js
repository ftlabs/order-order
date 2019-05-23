import express from 'express';

const router = express.Router();
import dynamoDb from '../models/dynamoDb';

router.post('/debate/edit', async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.id ||
      !data.debateType ||
      !data.title ||
      !data.description ||
      !data.debateStatus ||
      !data.votingStatus
    ) {
      return res.json({
        status: 'error',
        msg: 'Missing all required POST vars',
        field: 'global',
      });
    }

    data.timestamp = new Date().getTime();

    const debate = await dynamoDb.editDebate(data);
    return res.json({ status: 'ok', data: debate });
  } catch (err) {
    return res
      .status(404)
      .send("Sorry can't find that! Issue with POST /debate/create");
  }
});

router.put('/debate/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const data = req.body;
  try {
    const result = await dynamoDb.updateDebate(uuid, data);
    res.send(JSON.stringify(result));
  } catch (err) {
    res
      .status(404)
      .send(`Sorry can't find that! Issue with PUT /debate/${uuid}`);
  }
});

export default router;
