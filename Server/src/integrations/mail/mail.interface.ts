export abstract class MailService {
  /**
   * Generic method to send an email.
   * - Any provider like (Brevo, Resend, SendGrid, etc).
   */
  abstract sendEmail(
    toEmail: string,
    toName: string,
    subject: string,
    html: string,
  ): Promise<boolean>;
}
