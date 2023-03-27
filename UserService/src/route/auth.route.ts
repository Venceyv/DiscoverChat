import express from 'express';
import emailService from '../service/email.service';
import jwtService from '../service/jwt.service';
import authValidator from '../validator/auth.validator';
import { EmailType } from '../service/email.service';
import User from '../model/user.model';
import vars from '../config/vars.config';

type AuthEmailType = {
  type: EmailType;
};

interface RegisterUserOptions extends AuthEmailType {
  email: string;
}

interface LoginUserOptions extends AuthEmailType {
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
router.route('/confirm').get(async (req, res) => {
  res.send('In progress -> 🏗🚧👷‍♀️👷‍♂️');
});

router.route('/register').get(async (req, res, next) => {
  try {
    const userEmail = authValidator.emailSchema.parse(req.body.email);
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
