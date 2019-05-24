import express from 'express';
const router = express.Router();
import dynamoDb from '../../models/dynamoDb';
// import { getS3oUsername } from '../../helpers/cookies';

import debateRoutes from './debate';
import debateTypeRoutes from './debateType';

router.get('/', async (req, res) => {
  // const username = getS3oUsername(req.cookies);

  try {
    const debateList = await dynamoDb.getAllDebateLists();
    res.render('admin/index', {
      // username,
      debateList,
      page: 'dashboard'
    });
  } catch (err) {
    console.log('getting here');
    console.error(err);
    res.status(404).send("Sorry can't find that!");
  }
});

router.get('/moderation', async (req, res) => {
  // const username = getS3oUsername(req.cookies);

  try {
    const reports = await dynamoDb.getAllReports();

    res.render('admin/moderation', {
      // username,
      reports,
      page: 'moderation'
    });
  } catch (err) {
    res.status(404).send("Sorry can't find that!");
  }
});

router.use('/debate', debateRoutes);
router.use('/debate_type', debateTypeRoutes);

export default router;
