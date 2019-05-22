const express = require('express');

const router = express.Router();
const dynamoDb = require('../../models/dynamoDb');
const { getS3oUsername } = require('../../helpers/cookies');

router.get('/create', (req, res) => {
  try {
    const username = getS3oUsername(req.cookies);
    const { alertType, alertAction } = req.query;

    res.render('admin/createDebateType', {
      username,
      page: 'create-type',
      alertMessage: getAlertMessage(
        alertType,
        alertAction ? alertAction : 'creating',
      ),
      alertType,
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.post('/create', async (req, res) => {
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
    let mergedSpecialUsers = [...defaultSpecialUser];
    if (specialUsers) {
      mergedSpecialUsers = [...mergedSpecialUsers, ...specialUsers];
    }
    const result = await dynamoDb.createDebateType({
      specialUsers: mergedSpecialUsers,
      name,
      description,
      displayName,
    });
    res.redirect(
      `/admin/debate_type/edit/${name}?alertType=success&alertAction=creating`,
    );
  } catch (err) {
    console.error(err);
    res.redirect(
      `/admin/debate_type/create?alertType=error&alertAction=creating`,
    );
  }
});

router.get('/edit/:debateName', async (req, res) => {
  try {
    const { alertType, alertAction } = req.query;
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
      alertMessage: getAlertMessage(
        alertType,
        alertAction ? alertAction : 'editing',
      ),
      alertType,
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.post('/edit/:debateName', async (req, res) => {
  try {
    const { specialUsers, name, description, displayName } = req.body;
    const { debateName } = req.params;

    const result = await dynamoDb.createDebateType({
      specialUsers,
      name: debateName,
      description,
      displayName,
    });
    if (result.error) {
      throw new Error(result.error);
    }
    res.redirect(
      `/admin/debate_type/edit/${debateName}?alertType=success&alertAction=editing`,
    );
  } catch (err) {
    console.error(err);
    res.redirect(
      `/admin/debate_type/edit/${debateName}?alertType=error&alertAction=editing`,
    );
  }
});

function getAlertMessage(alertType, action) {
  switch (alertType) {
    case 'success':
      return `${action} your debate type was succesful.`;
    case 'error':
      return `Something went wrong ${action} your debate type.`;
    default:
      return undefined;
  }
}

module.exports = router;
