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

router.get('/create_debate', async (req, res) => {
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

router.post('/create_debate', async (req, res) => {
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
    const spcialUsersFormatted = specialUsers
      ? formatSpecialUsers(specialUsers)
      : [];

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
});

router.get('/edit_debate/:debateUuid', async (req, res) => {
  const username = getS3oUsername(req.cookies);

  try {
    const debate = await dynamoDb.getById(req.params.debateUuid);

    if (!debate.Items || debate.Items.length === 0) {
      res.status(404).send('Sorry no debate with that id');
      return;
    }

    const {
      id,
      debateType,
      debateStatus,
      description,
      title,
      votingStatus,
      specialUsers,
    } = debate.Items[0];

    const debateTypeInformation = await dynamoDb.getDebateType(debateType);

    const specialUsersInformation = debateTypeInformation.Items[0].specialUsers.map(
      userType => {
        const userList = specialUsers.find(
          userInformation => userInformation.userType === userType.name,
        );
        return { ...userType, ...userList };
      },
    );

    res.render('admin/editDebate', {
      username,
      id,
      debateType,
      debateStatus,
      description,
      title,
      votingStatus,
      specialUsers,
      specialUsersInformation,
      page: 'edit',
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.post('/edit_debate/:uuid', async (req, res) => {
  const username = getS3oUsername(req.cookies);
  try {
    const { uuid } = req.params;
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
    const spcialUsersFormatted = specialUsers
      ? formatSpecialUsers(specialUsers)
      : [];

    const params = {
      title,
      description,
      debateStatus,
      votingStatus,
      specialUsers: spcialUsersFormatted,
    };
    const debateTypeInformation = await dynamoDb.updateDebate(uuid, params);
  } catch (err) {
    console.error(err);
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

router.get('/create_debate_type', (req, res) => {
  const username = getS3oUsername(req.cookies);

  res.render('admin/createDebateType', {
    username,
    page: 'create-type',
  });
});

router.post('/create_debate_type', async (req, res) => {
  try {
    const { specialUsers, name, description, displayName } = req.body;
    const defaultSpecialUser = [
      {
        name: 'allowedUsers',
        description: 'Add users to a allow list.',
        displayName: 'Allowed Users',
      },
      {
        name: 'blockedUsers',
        description: 'Add users to a block list.',
        displayName: 'Blocked Users',
      },
    ];
    const result = await dynamoDb.createDebateType({
      specialUsers: [...defaultSpecialUser, ...specialUsers],
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

router.get('/edit_debate_type/:debateName', async (req, res) => {
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

function formatSpecialUsers(specialUsers) {
  let spcialUsersFormatted = [];
  Object.keys(specialUsers).forEach(userType => {
    if (typeof specialUsers[userType] === 'string') {
      specialUsers[userType] = [specialUsers[userType]];
    }
    spcialUsersFormatted = [
      ...spcialUsersFormatted,
      { userType, users: specialUsers[userType] },
    ];
  });
  return spcialUsersFormatted;
}

module.exports = router;
