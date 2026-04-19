import { UserResponseDto } from '../dto/user-response.dto';

export interface PaginatedUsers {
  data: UserResponseDto[];
  total: number;
  page: number;
  lastPage: number;
}
