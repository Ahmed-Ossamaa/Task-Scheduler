import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-messages.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetAdminMessagesDto } from './dto/get-admin-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message.dto';
import { PaginatedMessages } from './interfaces/paginated-messages.interface';

@Injectable()
export class ContactMessagesService {
  constructor(
    @InjectRepository(ContactMessage)
    private messageRepository: Repository<ContactMessage>,
  ) {}

  /**
   * create a new message
   */
  async createMessage(dto: CreateMessageDto): Promise<{ message: string }> {
    await this.messageRepository.insert(dto);
    return { message: 'Your message has been sent successfully.' };
  }

  /**
   * @description get all messages paginated with optional filters and sorting
   * @param queryParams - {status?, sortBy?, order?, page?, limit?}
   * @returns {PaginatedMessages} - paginated messages
   */
  async getAllMessages(
    queryParams: GetAdminMessagesDto,
  ): Promise<PaginatedMessages> {
    //dstruct the query params
    const {
      status,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 50,
    } = queryParams;

    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [data, total] = await this.messageRepository.findAndCount({
      where: {
        ...(status && { status }), // if status is provided, add it to the where
      },
      order: {
        [sortBy]: order, //default to createdAt: des
      },
      skip,
      take,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  /**
   * update message status (read, unread)
   */
  async updateMessageStatus(
    id: string,
    dto: UpdateMessageStatusDto,
  ): Promise<ContactMessage> {
    const message = await this.messageRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.status = dto.status;
    return this.messageRepository.save(message);
  }

  /**
   * soft delete a message
   */
  async softDeleteMessage(id: string): Promise<{ message: string }> {
    const result = await this.messageRepository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException('Message not found');
    }

    return {
      message: 'Message deleted successfully',
    };
  }

  /**
   * get all soft deleted messages (Paginated)
   */
  async getArchived(
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedMessages> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [data, total] = await this.messageRepository.findAndCount({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      order: {
        deletedAt: 'DESC',
      },
      skip,
      take,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }

  /**
   * restore a soft deleted message
   */
  async restoreMessage(id: string): Promise<{ message: string }> {
    const result = await this.messageRepository.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException('Message not found or not deleted');
    }

    return {
      message: 'Message restored successfully',
    };
  }
}
