import express from 'express';
import googleCloud from '../../service/googleCloud.service';
import multerFileProcess from '../../middleware/fileProcess.middleware';
import { APIError } from '../../middleware/error.middleware';
import User from '../../model/user.model';
import { userSchema } from '../../validator/user.validator';
import {
  UserProfileType,
  UserProfileTypeWithID,
  userProfileNotFound,
  userProfileOther,
  userProfileSelf,
} from '../../modo-assets/profile';
import jwtService from '../../service/jwt.service';
import { JwtPayload } from 'jsonwebtoken';
const router = express.Router();

router.route('/').post(async (req, res, next) => {
  try {
    const verifiedToken: JwtPayload = (await jwtService.verifyToken(
      req.cookies.DC_token
    )) as JwtPayload;

    const isExistUser = await User.findOne({ _id: verifiedToken._id }).exec();

    if (isExistUser) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }

    const requestUser = userSchema.parse(req.body);
    const user = await User.create(requestUser);
    res.status(201).json({ message: 'User created successfully.', data: user });
  } catch (error) {
    next(error);
  }
});

// NOTE: gservice upload
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

// get user profile
router.route('/:userId').get(async (req, res, next) => {
  try {
    const token = req.cookies.DC_token;
    const verifiedToken: JwtPayload = (await jwtService.verifyToken(token)) as JwtPayload;

    const user = await User.findById(verifiedToken.id);

    if (!user) {
      res.json(userProfileNotFound());
      return;
    }

    if (verifiedToken.id == req.params.userId) {
      const data: UserProfileType = {
        userImageUrl: user.profilePic,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        major: user.majorList,
        birthday: user.birthday,
        description: user.description,
      };
      res.json(userProfileSelf(data));
      return;
    }

    // Not self
    const data: UserProfileTypeWithID = {
      _id: user.id,
      userImageUrl: user.profilePic,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      major: user.majorList,
      birthday: user.birthday,
      description: user.description,
      isFriend: true, //! TODO: determine if is friend
      isBlock: true, //! TODO: determine if is blocked
    };
    res.json(userProfileOther(data));
  } catch (err) {
    next(err);
  }
});

export default router;
