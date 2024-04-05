import { type ContactMailFormValue } from "@/schemas/contact-mail-schema";
import sgMail from "@sendgrid/mail";

interface SendMailParams {
  data: ContactMailFormValue;
}

const { SENDGRID_API_KEY, SENDER_MAIL_ACC, RECEIVER_MAIL_ACC } = process.env;

export const handleContactMail = ({ data }: SendMailParams) => {
  sgMail.setApiKey(SENDGRID_API_KEY ?? "");
  const formattedMessage = data.message.replace(/\n/g, "<br>");

  const emailData = {
    to: RECEIVER_MAIL_ACC,
    from: SENDER_MAIL_ACC ?? "",
    subject: `Expense tracker: ${data.subject}`,
    html: `<h1>Email from ${data.name}</h1>
          <p>Contact to: <strong>${data.contactMail}</strong></p>
          <p>Subject: <strong>${data.subject}</strong></p>
          <h3>Message:</h3>
          <p>${formattedMessage}</p>
          `,
  };
  return sgMail.send(emailData);
};
