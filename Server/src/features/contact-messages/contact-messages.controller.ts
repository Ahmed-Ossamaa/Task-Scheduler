import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactMessagesService } from './contact-messages.service';
import { GetAdminMessagesDto } from './dto/get-admin-message.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-roles.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message.dto';
import { Throttle } from '@nestjs/throttler';
import { PaginatedMessages } from './interfaces/paginated-messages.interface';
import { ContactMessage } from './entities/contact-messages.entity';

@Controller('contact-messages')
export class ContactMessagesController {
  constructor(private readonly contactService: ContactMessagesService) {}

  @ApiOperation({ summary: 'Send message to admin from contact form (public)' })
  @Throttle({ defaults: { limit: 4, ttl: 600000 } }) //4 per 10 min
  @Post()
  async submitMessage(
    @Body() createDto: CreateMessageDto,
  ): Promise<{ message: string }> {
    return await this.contactService.createMessage(createDto);
  }

  @ApiOperation({
    summary: 'Get All messages for admin (filtered?/sorted?/paginated!)',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  getAdminMessages(
    @Query() query: GetAdminMessagesDto,
  ): Promise<PaginatedMessages> {
    return this.contactService.getAllMessages(query);
  }

  @ApiOperation({ summary: 'Mark message as read/unread' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':msgId/status')
  updateStatus(
    @Param('msgId') msgId: string,
    @Body() updateDto: UpdateMessageStatusDto,
  ): Promise<ContactMessage> {
    return this.contactService.updateMessageStatus(msgId, updateDto);
  }

  @ApiOperation({ summary: 'Get all archived messages (paginated)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('archive')
  getArchived() {
    return this.contactService.getArchived();
  }

  @ApiOperation({ summary: 'Soft delete message' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':msgId')
  deleteMessage(@Param('msgId') msgId: string): Promise<{ message: string }> {
    return this.contactService.softDeleteMessage(msgId);
  }

  @ApiOperation({ summary: 'Restore soft deleted message' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':msgId/restore')
  restoreMessage(@Param('msgId') msgId: string): Promise<{ message: string }> {
    return this.contactService.restoreMessage(msgId);
  }
}
