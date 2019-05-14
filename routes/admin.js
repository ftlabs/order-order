const express = require('express');

const router = express.Router();
const dynamoDb = require('../models/dynamoDb');
const Utils = require('../helpers/utils');
const { getS3oUsername } = require('../helpers/cookies');
const debateTypeDescriptions = require('../data/debates.json');

router.get('/', async (req, res) => {
  const username = getS3oUsername(req.cookies);

  try {
    const debateList = await dynamoDb.getAllDebateLists();
    res.render('admin/index', {
      username,
      debateList,
      page: 'dashboard',
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/create_debate', (req, res) => {
  const username = getS3oUsername(req.cookies);
  const debateDescriptions = debateTypeDescriptions.descriptions;

  res.render('admin/create_debate', {
    username,
    debateDescriptions,
    page: 'create',
  });
});

router.get('/edit_debate/:debate_uuid', async (req, res) => {
  const username = getS3oUsername(req.cookies);

  try {
    const debate = await dynamoDb.getById(req.params.debate_uuid);

    if (!debate.Items || debate.Items.length === 0) {
      res.status(404).send('Sorry no debate with that id');
      return;
    }

    let debateDescription = '';
    debateTypeDescriptions.descriptions.forEach(debateType => {
      if (debateType.name === debate.Items[0].debateType) {
        debateDescription = debateType.description;
      }
    });

    res.render('admin/edit_debate', {
      username,
      debate: debate.Items[0],
      debateDescription,
      page: 'edit',
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/moderation', async (req, res) => {
  const username = getS3oUsername(req.cookies);

  try {
    const reports = await dynamoDb.getAllReports();

    res.render('admin/moderation', {
      username,
      reports,
      page: 'moderation',
    });
  } catch (err) {
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
