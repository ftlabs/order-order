/* eslint-disable import/no-dynamic-require */

const express = require('express');

const router = express.Router();
const s3o = require('@financial-times/s3o-middleware');
const path = require('path');
const apiRoutes = require('../routes/api');
const adminRoutes = require('../routes/admin');
const commentRoutes = require('../routes/comment');
const voteRoutes = require('../routes/vote');
const ratingRoutes = require('./rating');
const listing = require('../helpers/listings');
const Utils = require('../helpers/utils');
const dynamoDb = require('../models/dynamoDb');
const { getS3oUsername } = require('../helpers/cookies');
const debateTypeDescriptions = require('../data/debates.json');

router.use('/api', apiRoutes);
router.use(s3o);
router.use('/comment', commentRoutes);
router.use('/vote', voteRoutes);
router.use('/rating', ratingRoutes);
router.use('/admin', adminRoutes);

router.get('/', async (req, res, next) => {
  const username = getS3oUsername(req.cookies);

  try {
    const debateList = await dynamoDb.getAllDebateLists('flat');

    res.render('list', {
      pageTitle: 'FT Debates',
      pageSubtitle:
        "Welcome to FT debates, here's a list of all available debates and a bit more blurb on how to take part",
      pageType: 'home',
      debateList,
      user: {
        username,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/type/:debateType', async (req, res, next) => {
  const username = getS3oUsername(req.cookies);

  try {
    const { debateType } = req.params;
    const debateList = await dynamoDb.getDebateList(debateType);

    if (debateList[`${debateType}`] === undefined) {
      next(`No debates found for debateType '${debateType}'`);
      return;
    }

    const debateListByType = debateList[`${debateType}`].debates;

    let debateDescription = '';
    debateTypeDescriptions.descriptions.forEach(debate => {
      if (debate.name === debateType) {
        debateDescription = debate.description;
      }
    });

    res.render('list', {
      pageTitle: `${debateType}`,
      pageSubtitle: debateDescription,
      pageType: 'home',
      debateList: debateListByType,
      user: {
        username,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:debateId', async (req, res, next) => {
  try {
    const { debateId } = req.params;
    const result = await dynamoDb.getById(debateId);
    const username = getS3oUsername(req.cookies);
    const debate = result.Items[0];

    const data = {
      debate: debate,
      user: {
        username,
      },
    };

    if (debate && Utils.hasOwnPropertyCall(debate, 'debateType')) {
      /* eslint-disable global-require */

      const modulePath = path.resolve(
        `${listing.getRootDir()}/modules/${debate.debateType.toLowerCase()}`,
      );
      const moduleType = require(modulePath);

      /* eslint-disable global-require */

      moduleType.display(req, res, data);
      return;
    } else {
      throw new Error(`Debate not found with the id: ${debateId}`);
      return;
    }
  } catch (err) {
    next(err);
  }
});

router.post('/:debateId', async (req, res, next) => {
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
    next(err);
  }
});

router.use(function(err, req, res, next) {
  console.log(err);
  res.status(404);

  if (req.accepts('html')) {
    res.render('404', {
      url: req.url,
      method: req.method,
      url: req.url,
      error: err,
      user: {
        username: getS3oUsername(req.cookies),
      },
    });
    return;
  }

  if (req.accepts('json')) {
    res.send({ msg: 'Not found', error: err });
    return;
  }

  res.type('txt').send('Not found');
});

module.exports = router;
