import express from 'express';
import emailService from '../service/email.service';
import jwtService from '../service/jwt.service';
import authValidator from '../validator/auth.validator';
import { EmailType } from '../service/email.service';
import User from '../model/user.model';
import vars from '../config/vars.config';
import { JwtPayload } from 'jsonwebtoken';
import { APIError } from '../middleware/error.middleware';
import { userSchema } from '../validator/user.validator';

type AuthEmailType = {
  type: EmailType;
};

interface RegisterUserOptions extends AuthEmailType {
  email: string;
}

const router = express.Router();

router.route('/login').get(async (req, res, next) => {
  try {
    const userEmail = authValidator.emailSchema.parse(req.body.email);
    const user = await User.findOne({ email: userEmail });
    // send 200 response regardless
    if (!user) return res.status(200).json({ message: 'Login email sent successfully.' });

    // send emails if email exists
    const userOptions = { id: user._id, email: user.email, type: 'login' };

    const token = await jwtService.generateToken(userOptions);
    const magicLink = `${vars.domain}/auth/confirm?email=${userEmail}&token=${token}&type=login`;

    const userName = user.firstName ? user.firstName : 'user';
    await emailService.authEmail(userName, userEmail, magicLink, 'login');
    res.status(200).json({ message: 'Login email sent successfully.' });
  } catch (error) {
    next(error);
  }
});

// TODO
router.route('/confirm').get(async (req, res, next) => {
  try {
    const confirmToken = req.query['token'] as string;

    // throws if invalid
    const verifiedToken = (await jwtService.verifyToken(confirmToken)) as JwtPayload;

    const isBlacklistToken = await jwtService.checkBlacklistToken(confirmToken, 'verify');

    // token used
    if (isBlacklistToken) {
      next(new APIError(401, 'Invalid verification link.'));
      return;
    }

    // reconstruct payload
    const newPayload = { ...verifiedToken };
    delete newPayload.iat;
    delete newPayload.exp;

    if (newPayload.type === 'register') {
      const newUser = userSchema.parse({ email: newPayload.email });
      const token = await User.create(newUser);
      newPayload.id = token.id;
    }
    newPayload.type = 'login';

    const accessToken = await jwtService.generateToken(newPayload);
    await jwtService.blacklistToken(confirmToken, 'verify');
    res
      .cookie('DC_token', accessToken, {
        httpOnly: true,
        secure: vars.nodeEnvironment === 'production',
      })
      .status(200)
      .json({ message: 'Successful verified.' });
  } catch (error) {
    next(error);
  }
});

router.route('/register').get(async (req, res, next) => {
  try {
    const userEmail = authValidator.emailSchema.parse(req.body.email);

    const user = await User.findOne({ email: userEmail });

    if (user) {
      next(new APIError(400, 'Email already exists.'));
      return;
    }

    const userOptions: RegisterUserOptions = { email: userEmail, type: 'register' };
    const token = await jwtService.generateToken(userOptions);
    const magicLink = `${vars.domain}/auth/confirm?email=${userEmail}&token=${token}&type=register`;

    await emailService.authEmail(null, userEmail, magicLink, userOptions.type);
    res.status(200).json({ message: 'Register email sent successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
