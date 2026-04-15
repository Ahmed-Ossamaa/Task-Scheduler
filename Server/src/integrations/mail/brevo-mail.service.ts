import { Injectable, Logger, Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import mailConfig from '../../config/mail.config';
import { MailService } from './mail.interface';

@Injectable()
export class BrevoMailService implements MailService {
  private readonly logger = new Logger(BrevoMailService.name);
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {}

  async sendEmail(
    toEmail: string,
    toName: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    const payload = {
      sender: {
        name: this.config.senderName,
        email: this.config.senderEmail,
      },
      to: [{ email: toEmail, name: toName }],
      subject: subject,
      htmlContent: html,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey!,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as Record<string, string>;
        throw new Error(
          errorData.message ||
            JSON.stringify(errorData) ||
            'error sending email',
        );
      }

      this.logger.log(`Email sent successfully to ${toEmail}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${toEmail}`,
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }
}
