import { resend } from '@/lib/resend';

interface SendMailParams {
  token: string;
  receiverMail: string;
  prevEmail: string;
}

const { APP_BASE_URL_DEV, APP_BASE_URL_PROD, NODE_ENV } = process.env;

export const handleChangeEmailMail = ({ token, receiverMail, prevEmail }: SendMailParams) => {
  const emailData = {
    to: receiverMail,
    subject: `Change Your Email in Expense Tracker`,
    html: `
        <p>Hello,</p>
        <p>You're about to change your email in Expense Tracker. To confirm this email and associate it with the account previously using ${prevEmail}, please visit the link below:</p>
        <a href="${NODE_ENV === 'production' ? APP_BASE_URL_PROD : APP_BASE_URL_DEV}/auth/change-email?token=${token}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;" target="_blank" rel="noopener noreferrer">Change Email</a>
        <p>This link will expire in 1 hour. If you did not request to change the account to this email, please ignore this email or let us know at <a href="mailto:info@pabloaviles.dev">info@pabloaviles.dev</a>.</p>
        `,
    text: `Hello,\n\nTo confirm this email and associate it with the account previously using ${prevEmail}, copy and paste the following link into your browser: ${NODE_ENV === 'production' ? APP_BASE_URL_PROD : APP_BASE_URL_DEV}/auth/change-email?token=${token}\n\nThis link will expire in 1 hour. If you did not request an account, please ignore this email or let us know at info@pabloaviles.dev.`,
  };
  return resend.sendMail(emailData);
};
