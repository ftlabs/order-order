/* eslint-disable import/no-dynamic-require */

import express from 'express';

const router = express.Router();
import s3o from ('@financial-times/s3o-middleware');
import path from 'path';
import apiRoutes from '../routes/api';
import adminRoutes from './admin/main';
import commentRoutes from '../routes/comment';
import voteRoutes from '../routes/vote';
import ratingRoutes from './rating';
import listing from '../helpers/listings';
import dynamoDb from '../models/dynamoDb';
// import { getS3oUsername } from '../helpers/cookies';
import debateTypeDescriptions from '../data/debates.json';

router.use('/api', apiRoutes);
router.use(s3o);
router.use('/comment', commentRoutes);
router.use('/vote', voteRoutes);
router.use('/rating', ratingRoutes);
router.use('/admin', adminRoutes);

router.get('/', async (req, res) => {
  // const username = getS3oUsername(req.cookies);

  try {
    const debateList = await dynamoDb.getAllDebateLists('flat');

    res.render('list', {
      pageTitle: 'FT Debates',
      pageSubtitle:
        "Welcome to FT debates, here's a list of all available debates and a bit more blurb on how to take part",
      pageType: 'home',
      debateList,
      user: {
        // username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/type/:debateType', async (req, res) => {
  // const username = getS3oUsername(req.cookies);

  try {
    const { debateType } = req.params;
    const debateList = await dynamoDb.getDebateList(debateType);
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
        // username
      }
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/:debateId', async (req, res) => {
  try {
    const { debateId } = req.params;
    const result = await dynamoDb.getById(debateId);
    // const username = getS3oUsername(req.cookies);
    const debate = result.Items[0];

    const data = {
      debate: debate,
      user: {
        // username
      }
    };

    /* eslint-disable global-require */

    const modulePath = path.resolve(
      `${listing.getRootDir()}/src/modules/${debate.debateType.toLowerCase()}`
    );
    const moduleType = require(modulePath);

    /* eslint-disable global-require */

    moduleType.display(req, res, data);
    return;
  } catch (err) {
    console.log(err);
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
            displayStatus
          })
        ],
        ...data
      };
    }

    await dynamoDb.updateDebate(debateId, data);
    res.redirect(backURL);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

export default router;
