import express from 'express';
const router = express.Router();

router.route('/').get(async (req, res) => {
  res.sendStatus(200).send('Hi user');
});

export default router;
