import { UserResponseDto } from 'src/features/users/dto/user-response.dto';

export interface AuthResponse {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}
