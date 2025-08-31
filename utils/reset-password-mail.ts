import { resend } from '@/lib/resend';

interface SendMailParams {
  token: string;
  receiverMail: string;
}

const { APP_BASE_URL_DEV, APP_BASE_URL_PROD, NODE_ENV } = process.env;

export const handleResetPasswordMail = ({ token, receiverMail }: SendMailParams) => {
  const emailData = {
    to: receiverMail,
    subject: `Reset Your Password on Expense Tracker`,
    html: `
          <p>Hello,</p>
          <p>You have requested to reset your password on Expense Tracker. Click the button below to proceed:</p>
          <a href="${NODE_ENV === 'production' ? APP_BASE_URL_PROD : APP_BASE_URL_DEV}/auth/reset?token=${token}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;" target="_blank" rel="noopener noreferrer">Reset Password</a>
          <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact us at <a href="mailto:info@pabloaviles.dev">info@pabloaviles.dev</a>.</p>
          `,
    text: `You have requested to reset your password on Expense Tracker. Please copy and paste the following link into your browser: ${NODE_ENV === 'production' ? APP_BASE_URL_PROD : APP_BASE_URL_DEV}/auth/recovery?token=${token} This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact us at info@pabloaviles.dev.`,
  };
  return resend.sendMail(emailData);
};
