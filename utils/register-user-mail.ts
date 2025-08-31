import { resend } from '@/lib/resend';

interface SendMailParams {
  token: string;
  receiverMail: string;
}

const { APP_BASE_URL_DEV, APP_BASE_URL_PROD, NODE_ENV } = process.env;

export const handleRegisterUserMail = ({ token, receiverMail }: SendMailParams) => {
  const emailData = {
    to: receiverMail,
    subject: `Complete Your Registration with Expense Tracker`,
    html: `
        <p>Hello,</p>
        <p>You're just one step away from creating your account on Expense Tracker. Please click the button below to confirm your email address and activate your account:</p>
        <a href="${NODE_ENV === 'production' ? APP_BASE_URL_PROD : APP_BASE_URL_DEV}/auth/register?token=${token}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;" target="_blank" rel="noopener noreferrer">Activate Account</a>
        <p>This link will expire in 1 hour. If you did not request an account, please ignore this email or let us know at <a href="mailto:info@pabloaviles.dev">info@pabloaviles.dev</a>.</p>
        `,
    text: `Hello,\n\nYou're just one step away from creating your account on Expense Tracker. Please copy and paste the following link into your browser to confirm your email address and activate your account: ${NODE_ENV === 'production' ? APP_BASE_URL_PROD : APP_BASE_URL_DEV}/auth/register?token=${token}\n\nThis link will expire in 1 hour. If you did not request an account, please ignore this email or let us know at info@pabloaviles.dev.`,
  };
  return resend.sendMail(emailData);
};
