const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1');
const dynamo_db = require('../models/dynamo_db');

router.post('/debate/create', async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.type ||
      !data.title ||
      !data.description ||
      !data.status ||
      !data.voting_status
    ) {
      res.json({
        status: 'error',
        msg: 'Missing all required POST vars',
      });
      res.end();
      return;
    }

    const uuid = uuidv1();
    const timestamp = new Date().getTime();
    const params = {
      Item: {
        id: uuid,
        title: data.title,
        description: data.description,
        debateType: data.type,
        comments: [],
        status: data.status,
        voting_status: data.voting_status,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };
    const debate = await dynamo_db.addDebate(params);
    res.send(JSON.stringify(debate));
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .send("Sorry can't find that! Issue with POST /debate/create");
  }
});

router.get('/debate/:uuid', async (req, res) => {
  const { uuid } = req.params;
  try {
    const debate = await dynamo_db.getById(uuid);
    res.send(JSON.stringify(debate));
  } catch (err) {
    console.error(err);
    res
      .status(404)
      .send(`Sorry can't find that! Issue with GET /debate/${uuid}`);
  }
});

router.put('/debate/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const data = req.body;
  try {
    const result = await dynamo_db.updateDebate(uuid, data);
    res.send(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that! Issue with GET /debate/types");
  }
});

router.get('/debate/types', async (req, res) => {
  try {
    const allDebateTypes = await dynamo_db.getAllTypes();
    res.send(JSON.stringify(allDebateTypes));
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that! Issue with GET /debate/types");
  }
});

module.exports = router;
