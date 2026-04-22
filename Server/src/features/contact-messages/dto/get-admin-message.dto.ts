import { IsEnum, IsIn, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageStatus } from '../interfaces/message-status-enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAdminMessagesDto {
  @ApiPropertyOptional({ example: 'Unread', enum: MessageStatus })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @ApiPropertyOptional({ example: 'createdAt', enum: ['createdAt', 'status'] })
  @IsOptional()
  @IsIn(['createdAt', 'status'])
  sortBy?: 'createdAt' | 'status';

  @ApiPropertyOptional({ example: 'ASC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
