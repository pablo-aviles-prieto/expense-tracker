import sgMail from "@sendgrid/mail";

interface SendMailParams {
  token: string;
  receiverMail: string;
}

const { SENDGRID_API_KEY, SENDER_MAIL_ACC, APP_BASE_URL } = process.env;

export const handleResetPasswordMail = ({
  token,
  receiverMail,
}: SendMailParams) => {
  sgMail.setApiKey(SENDGRID_API_KEY ?? "");
  const emailData = {
    to: receiverMail,
    from: SENDER_MAIL_ACC ?? "",
    subject: `Reset Your Password on Expense Tracker`,
    html: `
          <p>Hello,</p>
          <p>You have requested to reset your password on Expense Tracker. Click the button below to proceed:</p>
          <a href="${APP_BASE_URL}/auth/reset?token=${token}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;" target="_blank" rel="noopener noreferrer">Reset Password</a>
          <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact us at <a href="mailto:info@pabloaviles.es">info@pabloaviles.es</a>.</p>
          `,
    text: `You have requested to reset your password on Expense Tracker. Please copy and paste the following link into your browser: ${APP_BASE_URL}/auth/recovery?token=${token} This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact us at info@pabloaviles.es.`,
  };
  return sgMail.send(emailData);
};
