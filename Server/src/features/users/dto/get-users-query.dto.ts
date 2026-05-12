import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { UserRole } from '../enums/user-roles.enum';

export class GetUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit = 20;

  @IsOptional()
  search?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  status?: 'active' | 'banned';

  @IsOptional()
  @IsUUID()
  organizationId?: string;
}
