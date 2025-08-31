import { resend } from '@/lib/resend';
import { type ContactMailFormValue } from '@/schemas/contact-mail-schema';

interface SendMailParams {
  data: ContactMailFormValue;
}

const { RECEIVER_MAIL_ACC } = process.env;

export const handleContactMail = ({ data }: SendMailParams) => {
  const formattedMessage = data.message.replace(/\n/g, '<br>');

  const emailData = {
    to: RECEIVER_MAIL_ACC ?? '',
    subject: data.subject,
    html: `<h1>Email from ${data.name}</h1>
          <p>Contact to: <strong>${data.contactMail}</strong></p>
          <p>Subject: <strong>${data.subject}</strong></p>
          <h3>Message:</h3>
          <p>${formattedMessage}</p>
          `,
  };
  return resend.sendMail(emailData);
};
