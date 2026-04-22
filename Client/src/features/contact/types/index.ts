export type MessageStatus = 'Unread' | 'Read';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  deletedAt?: string | null;
}

export interface PaginatedMessages {
  data: ContactMessage[];
  total: number;
  page: number;
  lastPage: number;
}


export interface MsgQueryParams {
  status?: MessageStatus;
  sortBy?: 'createdAt' | 'status';
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}