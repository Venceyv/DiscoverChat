import express from 'express';
import googleCloud from '../../service/googleCloud.service';
import multerFileProcess from '../../middleware/fileProcess.middleware';
import { APIError } from '../../middleware/error.middleware';
import User from '../../model/user.model';
import { userSchema } from '../../validator/user.validator';
const router = express.Router();

router.route('/').post(async (req, res, next) => {
  try {
    //validate req body
    const requestUser = userSchema.parse(req.body);
    const user = await User.create(requestUser);
    res.status(201).json({ message: 'User created successfully.', data: user });
  } catch (error) {
    next(error);
  }
});

router
  .route('/profile')
  .post(multerFileProcess.fileProcess.single('discoverChatAsset'), async (req, res, next) => {
    try {
      if (!req.file) throw new APIError(400, 'invalid file input.');
      console.log(req.file);
      const imageUrl = await googleCloud.fileUpload(req.file);
      res.status(200).json({
        message: 'Upload was successful',
        data: imageUrl,
      });
    } catch (error) {
      next(error);
    }
  });

router.route('/:userId').get(async (req, res) => {
  //check auth if is user <-> token      <- middleware
  // if true
  // -> get self
  // if false
  // -> get userId

  res.send('Hi user 🤪');
});

export default router;
