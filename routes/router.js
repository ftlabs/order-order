/* eslint-disable import/no-dynamic-require */

const express = require('express');

const router = express.Router();
const s3o = require('@financial-times/s3o-middleware');
const path = require('path');
const apiRoutes = require('../routes/api');
const adminRoutes = require('../routes/admin');
const listing = require('../helpers/listings');
const dynamoDb = require('../models/dynamoDb');
const { getProperty } = require('../helpers/cookies');

router.use('/api', apiRoutes);
router.use(s3o);
router.use('/admin', adminRoutes);

router.get('/', async (req, res) => {
  const username = getProperty(req.cookies, 'username');

  try {
    const debateList = await dynamoDb.getAllDebateLists();
    res.render('list', {
      pageTitle: 'Debates: All',
      pageSubtitle: 'List of all debates',
      pageType: 'home',
      debateList,
      user: {
        username,
      },
    });
  } catch (err) {
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/type/:debateType', async (req, res) => {
  const username = getProperty(req.cookies, 'username');

  try {
    const { debateType } = req.params;
    const debateList = await dynamoDb.getDebateList(debateType);

    res.render('list', {
      pageTitle: `Debates: ${debateType}`,
      pageSubtitle: `List of all ${debateType} type debates`,
      pageType: 'home',
      debateList,
      user: {
        username,
      },
    });
  } catch (err) {
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/:debateId', async (req, res) => {
  try {
    const { debateId } = req.params;
    const result = await dynamoDb.getById(debateId);
    const username = getProperty(req.cookies, 'username');

    const data = {
      debate: result.Items[0],
      user: {
        username,
      },
    };

    /* eslint-disable global-require */

    const moduleType = require(path.resolve(
      `${listing.getRootDir()}/modules/${debateType}`,
    ));

    /* eslint-disable global-require */

    moduleType.display(req, res, data);
  } catch (err) {
    res.status(404).send("Sorry can't find that!");
  }
});

router.post('/:debateId', async (req, res) => {
  const backURL = req.header('Referer') || '/';
  try {
    const { debateId } = req.params;
    const formData = req.body;
    let data = {};
    if (formData.comment) {
      const { comment, tags, displayStatus, replyTo } = formData;
      data = {
        comments: [
          dynamoDb.constructCommentObject({
            content: comment,
            user: req.cookies.s3o_username,
            tags,
            replyTo,
            displayStatus,
          }),
        ],
        ...data,
      };
    }
    await dynamoDb.updateDebate(debateId, data);
    res.redirect(backURL);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

module.exports = router;
