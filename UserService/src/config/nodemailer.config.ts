import nodeMailer from 'nodemailer';
import vars from './vars.config';

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: vars.nodeMailer.email,
    pass: vars.nodeMailer.password,
  },
});

export default transporter;
