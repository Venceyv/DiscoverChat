import express from 'express';
import googleCloud from '../../service/googleCloud.service';
import multerFileProcess from '../../middleware/fileProcess.middleware';
import { APIError } from '../../middleware/error.middleware';
import User from '../../model/user.model';
import { userSchema } from '../../validator/user.validator';
import jwtService from '../../service/jwt.service';
import { JwtPayload } from 'jsonwebtoken';
const router = express.Router();

type DataType = 'jsonData' | 'modoJson';

// @params type: modoJson || jsonData
// @Return Construct Modo || data
router.route('/').get(async (req, res) => {
  res.send();
});

router.route('/').post(async (req, res, next) => {
  try {
    // type: modoJson || jsonData
    // const requestType: DataType = req.params.dataType;
    // if (!requestType) {
    //   throw new APIError(400, 'Missing param type.');
    // }

    const verifiedToken: JwtPayload = (await jwtService.verifyToken(
      req.cookies.DC_token
    )) as JwtPayload;

    const user = User.find({ _id: { $not: verifiedToken.id } }).exec();

    // if (requestType === 'jsonData') {
    //   res.status(200).send();
    // }

    const requestUser = userSchema.parse(req.body);
    // const user = await User.create(requestUser);
    // res.status(201).json({ message: 'User created successfully.', data: user });
  } catch (error) {
    next(error);
  }
});

// userArr[0] = jwt.user determine, if userArr[0] - fill by major, then random user
//

// not change profile route, testing gservice upload
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

// IMPORTANT: PASS JWT TO DIFF SERVICES VIA AUTH HEADER
// AUTH GENERATION HAPPENS IN GATEWAY // maybe
// SERVICES GET TOKEN VIA AUTH HEADER BY API GATEWAY
// GEN Short TTL TOKEN INTER SERVICE COMM
// POSTMAN API DOC
// RETURN AT TO GATEWAY, SET COOKIE IN GATEWAY W/ AT VIA COOKIES

// get user profile
router.route('/:userId').get(async (req, res, next) => {
  try {
    const token = req.cookies.DC_token;
    const verifiedToken: JwtPayload = (await jwtService.verifyToken(token)) as JwtPayload;

    const user = await User.findById(verifiedToken.id);

    if (verifiedToken.id == req.params.userId) {
      return;
    }

    // send not self modo json
    return;
  } catch (err) {
    next(err);
  }
});

export default router;
