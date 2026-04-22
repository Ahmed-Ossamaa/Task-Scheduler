import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MessageStatus } from 'src/features/contact-messages/interfaces/message-status-enum';

export class UpdateMessageStatusDto {
  @ApiProperty({ example: 'Read' })
  @IsEnum(MessageStatus)
  status!: MessageStatus;
}
