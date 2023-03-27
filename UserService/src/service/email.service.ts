import nodeMailerTransporter from '../config/nodemailer.config';
import vars from '../config/vars.config';
import emailTemplates from './emailTemplates';

export type EmailType = 'register' | 'login';

function authEmail(
  username: string | null,
  userEmail: string,
  magicUrl: string,
  type: EmailType
): Promise<string | void> {
  const mailOptions = {
    from: vars.nodeMailer.email,
    to: 'steammingliu1@gmail.com',
    subject: `DiscoverChat ${type === 'register' ? 'Signup' : 'Login'}`,
    html:
      type === 'register'
        ? emailTemplates.registerEmailTemplate(magicUrl)
        : emailTemplates.loginEmailTemplate(username as string, magicUrl),
  };

  return new Promise((resolve, reject) => {
    nodeMailerTransporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        reject();
      } else {
        console.info('Email sent successfully: ' + info.response);
        resolve();
      }
    });
  });
}

export default {
  authEmail,
};
