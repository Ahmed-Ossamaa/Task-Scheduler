import { ContactMessage } from '../entities/contact-messages.entity';

export interface PaginatedMessages {
  data: ContactMessage[];
  total: number;
  page: number;
  lastPage: number;
}
