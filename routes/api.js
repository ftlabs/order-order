const express = require('express');

const router = express.Router();
const uuidv1 = require('uuid/v1');
const dynamoDb = require('../models/dynamoDb');

router.post('/debate/create', async (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().getTime();

    if (
      !data.debateType
      || !data.title
      || !data.description
      || !data.debateStatus
      || !data.votingStatus
    ) {
      res.json({
        status: 'error',
        msg: 'Missing all required POST vars',
      });
      res.end();
      return;
    }
    // Check if debate of this name exists already
    const checkDebateName = await dynamoDb.getBy('title', data.title);

    if (Object.prototype.hasOwnProperty.call(checkDebateName, 'error')) {
      res.json({
        status: 'error',
        msg: checkDebateName.error,
      });
      res.end();
      return;
    }

    if (checkDebateName.Items.length > 0) {
      res.json({
        status: 'error',
        msg: 'A debate with this name exists already',
      });
      res.end();
      return;
    }

    // Validation complete - create new debate
    data.id = uuidv1();
    data.timestamp = new Date().getTime();
    data.createdAt = timestamp;
    data.updatedAt = timestamp;

    const debate = await dynamoDb.addDebate(data);

    if (Object.prototype.hasOwnProperty.call(debate, 'error')) {
      res.json({
        status: 'error',
        msg: debate.error,
      });
      res.end();
      return;
    }
    res.send(JSON.stringify(debate));
  } catch (err) {
    res
      .status(404)
      .send("Sorry can't find that! Issue with POST /debate/create");
  }
});

router.post('/debate/edit', async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.id
      || !data.debateType
      || !data.title
      || !data.description
      || !data.debateStatus
      || !data.votingStatus
    ) {
      res.json({
        status: 'error',
        msg: 'Missing all required POST vars',
      });
      res.end();
      return;
    }

    data.timestamp = new Date().getTime();

    const debate = await dynamoDb.editDebate(data);

    res.json({ status: 'ok', data: debate });
  } catch (err) {
    res
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

router.get('/debate/types', async (req, res) => {
  try {
    const allDebateTypes = await dynamoDb.getAllTypes();
    res.send(JSON.stringify(allDebateTypes));
  } catch (err) {
    res.status(404).send("Sorry can't find that! Issue with PUT /debate/types");
  }
});

module.exports = router;
