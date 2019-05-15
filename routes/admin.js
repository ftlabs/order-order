const express = require('express');

const router = express.Router();
const dynamoDb = require('../models/dynamoDb');
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
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/create-debate', async (req, res) => {
<<<<<<< HEAD
  const username = getS3oUsername(req.cookies);
  const debateTypes = await dynamoDb.getAllDebateTypes();
  console.log(debateTypes);
  res.render('admin/createDebate', {
    username,
    debateDescriptions,
    page: 'create',
  });
=======
  try {
    const username = getS3oUsername(req.cookies);
    const debateTypes = await dynamoDb.getAllDebateTypes();

    res.render('admin/createDebate', {
      debateTypes: debateTypes.Items,
      username,
      page: 'create',
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/create-debate', async (req, res) => {
  try {
    const {
      debateType,
      title,
      description,
      debateStatus,
      votingStatus,
      specialUsers,
    } = req.body;
    if ((!debateType, !title, !description, !debateStatus, !votingStatus)) {
      throw new Error(
        'One of the required fields was not filled in correctly.',
      );
    }
    let spcialUsersFormatted = [];
    console.log(specialUsers);
    if (specialUsers) {
      Object.keys(specialUsers).forEach(userType => {
        if (typeof specialUsers[userType] === 'string') {
          specialUsers[userType] = [specialUsers[userType]];
        }
        spcialUsersFormatted = [
          ...spcialUsersFormatted,
          { userType, users: specialUsers[userType] },
        ];
      });
    }
    console.log(spcialUsersFormatted);
    const params = {
      debateType,
      title,
      description,
      debateStatus,
      votingStatus,
      specialUsers: spcialUsersFormatted,
    };
    const reports = await dynamoDb.createDebate(params);
  } catch (err) {
    console.error(err);
  }
>>>>>>> add create debate loading from debate type
});

router.get('/edit-debate/:debateUuid', async (req, res) => {
  const username = getS3oUsername(req.cookies);

  try {
    const debate = await dynamoDb.getById(req.params.debateUuid);

    if (!debate.Items || debate.Items.length === 0) {
      res.status(404).send('Sorry no debate with that id');
      return;
    }

<<<<<<< HEAD
    let debateDescription = '';
    debateTypeDescriptions.descriptions.forEach(debateType => {
      if (debateType.name === debate.Items[0].debateType) {
        debateDescription = debateType.description;
      }
    });

    res.render('admin/edit_debate', {
=======
    res.render('admin/editDebate', {
>>>>>>> add create debate loading from debate type
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
