const express = require('express');

const router = express.Router();
const dynamoDb = require('../models/dynamoDb');
const { getS3oUsername } = require('../helpers/cookies');

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
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/create-debate', async (req, res) => {
  const username = getS3oUsername(req.cookies);
  const debateTypes = await dynamoDb.getAllDebateTypes();
  console.log(debateTypes);
  res.render('admin/createDebate', {
    username,
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

    res.render('admin/edit_debate', {
      username,
      debate: debate.Items[0],
      page: 'edit',
    });
  } catch (err) {
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

router.get('/create-debate-type', (req, res) => {
  const username = getS3oUsername(req.cookies);

  res.render('admin/createDebateType', {
    username,
    page: 'create-type',
  });
});

router.post('/create-debate-type', async (req, res) => {
  try {
    const { specialUsers, name, description, displayName } = req.body;
    const result = await dynamoDb.createDebateType({
      specialUsers,
      name,
      description,
      displayName,
    });
    console.log(result);
    const username = getS3oUsername(req.cookies);
    res.render('admin/createDebateType', {
      username,
      success: true,
      page: 'create-type',
    });
  } catch (err) {
    console.error(err);
  }
});

router.get('/edit-debate-type/:debateName', async (req, res) => {
  try {
    const username = getS3oUsername(req.cookies);
    const { debateName } = req.params;
    const debateType = await dynamoDb.getDebateType(debateName);
    if (debateType.Items.length === 0) {
      throw new Error('Cant find debate type');
    }

    const {
      description,
      name,
      specialUsers,
      displayName,
    } = debateType.Items[0];

    res.render('admin/editDebateType', {
      username,
      description,
      name,
      displayName,
      specialUsers: specialUsers.map((specialUser, index) => ({
        ...specialUser,
        index,
      })),
      page: 'edit-type',
    });
  } catch (err) {
    console.error(err);
    res.render('admin/editDebateType', {
      error: 'Something went wrong retrieving your debate type',
      page: 'edit-type',
    });
  }
});

module.exports = router;
