import type { CreateEmailOptions, CreateEmailRequestOptions } from 'resend';
import { Resend } from 'resend';

// Utility extracted from resend to force at least one of the options (html, text, react)
type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type ContantMailPayload = Omit<CreateEmailOptions, 'from'> &
  RequireAtLeastOne<Pick<CreateEmailOptions, 'html' | 'text' | 'react'>> & {
    from?: string;
  };

class ResendClient {
  private client: Resend;
  private senderMail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY ?? '';
    const senderMail = process.env.SENDER_MAIL ?? '';
    this.client = new Resend(apiKey);
    this.senderMail = senderMail;
  }

  public async sendMail(payload: ContantMailPayload, options?: CreateEmailRequestOptions) {
    const mergedPayload = {
      from: `Expense Tracker <${this.senderMail}>`,
      ...payload,
    };
    return this.client.emails.send(mergedPayload, options);
  }
}

export const resend = new ResendClient();
