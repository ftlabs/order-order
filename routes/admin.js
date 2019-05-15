const express = require('express');

const router = express.Router();
const dynamoDb = require('../models/dynamoDb');
const { getS3oUsername } = require('../helpers/cookies');
const debateTypeDescriptions = require('../data/debates.json');

router.get('/', async (req, res, next) => {
  const username = getS3oUsername(req.cookies);

  try {
    const debateList = await dynamoDb.getAllDebateLists();
    res.render('admin/index', {
      username,
      debateList,
      page: 'dashboard',
    });
  } catch (err) {
    next(err);
  }
});

router.get('/create_debate', (req, res, next) => {
  const username = getS3oUsername(req.cookies);
  const debateDescriptions = debateTypeDescriptions.descriptions;

  res.render('admin/create_debate', {
    username,
    debateDescriptions,
    page: 'create',
  });
});

router.get('/edit_debate/:debate_uuid', async (req, res, next) => {
  const username = getS3oUsername(req.cookies);

  try {
    const debate = await dynamoDb.getById(req.params.debate_uuid);

    if (!debate.Items || debate.Items.length === 0) {
      throw new Error(`Debate not found with the id: ${debate_uuid}`);
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
    next(err);
  }
});

router.get('/moderation', async (req, res, next) => {
  const username = getS3oUsername(req.cookies);

  try {
    const reports = await dynamoDb.getAllReports();

    res.render('admin/moderation', {
      username,
      reports,
      page: 'moderation',
    });
  } catch (err) {
    next(err);
  }
});

router.get('/*', async (req, res, next) => {
  res.render('404', {
    url: req.url,
    method: req.method,
    url: req.url,
    error: 'No admin page found with that route',
    user: {
      username: getS3oUsername(req.cookies),
    },
  });
  return;
});

module.exports = router;
