const express = require('express');

const router = express.Router();
const uuidv1 = require('uuid/v1');
const dynamoDb = require('../models/dynamoDb');

router.post('/debate/create', async (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().getTime();

    if (
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
    // Check if debate of this name exists already
    const checkDebateName = await dynamoDb.getBy('title', data.title);

    if (Object.prototype.hasOwnProperty.call(checkDebateName, 'error')) {
      return res.json({
        status: 'error',
        msg: checkDebateName.error,
        field: 'title',
      });
    }

    if (checkDebateName.Items.length > 0) {
      return res.json({
        status: 'error',
        msg: 'A debate with this name exists already',
        field: 'title',
      });
    }

    // Validation complete - create new debate
    data.id = uuidv1();
    data.timestamp = new Date().getTime();
    data.createdAt = timestamp;
    data.updatedAt = timestamp;

    const debate = await dynamoDb.addDebate(data);

    if (Object.prototype.hasOwnProperty.call(debate, 'error')) {
      return res.json({
        status: 'error',
        msg: debate.error,
        field: 'global',
      });
    }

    return res.send(JSON.stringify(debate));
  } catch (err) {
    next(err);
  }
});

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
    next(err);
  }
});

router.put('/debate/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const data = req.body;
  try {
    const result = await dynamoDb.updateDebate(uuid, data);
    res.send(JSON.stringify(result));
  } catch (err) {
    next(err);
  }
});

router.get('/debate/types', async (req, res) => {
  try {
    const allDebateTypes = await dynamo_db.getAllTypes();
    return res.send(JSON.stringify(allDebateTypes));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
