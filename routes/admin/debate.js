const express = require('express');

const router = express.Router();
const dynamoDb = require('../../models/dynamoDb');
const { getS3oUsername } = require('../../helpers/cookies');

router.get('/create', async (req, res) => {
  try {
    const username = getS3oUsername(req.cookies);
    const debateTypes = await dynamoDb.getAllDebateTypes();
    const { alertType, alertAction } = req.query;

    res.render('admin/createDebate', {
      debateTypes: debateTypes.Items,
      username,
      page: 'create',
      alertType,
      alertAction,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post('/create', async (req, res) => {
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
    const results = await dynamoDb.createDebate(params);
    res.redirect(`/${results.id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/admin/debate/create?alertType=error&alertAction=creating`);
  }
});

router.get('/edit/:debateUuid', async (req, res) => {
  const username = getS3oUsername(req.cookies);
  try {
    const { debateUuid } = req.params;
    bob;
    const debate = await dynamoDb.getById(debateUuid);

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
    let specialUsersInformation = [];
    if (specialUsers.length < 0) {
      specialUsersInformation = debateTypeInformation.Items[0].specialUsers.map(
        userType => {
          const userList = specialUsers.find(
            userInformation => userInformation.userType === userType.name,
          );
          return { ...userType, ...userList };
        },
      );
    }

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
    res.redirect(
      `/admin/debate/edit/${debateUuid}?alertType=error&alertAction=editing`,
    );
  }
});

router.post('/edit/:uuid', async (req, res) => {
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
    await dynamoDb.updateDebate(uuid, params);
    res.redirect(`/${uuid}`);
  } catch (err) {
    console.error(err);
    res.redirect(
      `/admin/debate/edit/${debateUuid}?alertType=error&alertAction=editing`,
    );
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
