import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.interface';
import { BrevoMailService } from './brevo-mail.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MailService,
      useClass: BrevoMailService,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
