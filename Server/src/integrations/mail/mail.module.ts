import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.interface';
import { BrevoMailService } from './brevo-mail.service';

@Global()
@Module({
  providers: [
    {
      provide: MailService,
      useClass: BrevoMailService,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
