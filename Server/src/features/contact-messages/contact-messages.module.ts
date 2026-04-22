import { Module } from '@nestjs/common';
import { ContactMessagesService } from './contact-messages.service';
import { ContactMessagesController } from './contact-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage])],
  controllers: [ContactMessagesController],
  providers: [ContactMessagesService],
})
export class ContactMessagesModule {}
