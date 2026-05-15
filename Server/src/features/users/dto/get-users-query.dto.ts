import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { UserRole } from '../enums/user-roles.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit = 20;

  @ApiPropertyOptional({ example: 'ahmed or ahm' })
  @IsOptional()
  search?: string;
}
export class GetUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ enum: ['active', 'banned'] })
  @IsOptional()
  status?: 'active' | 'banned';

  @ApiPropertyOptional({ example: 'UUID string' })
  @IsOptional()
  @IsUUID()
  organizationId?: string;
}

export class GetEmployeesQueryDto extends PaginationQueryDto {}
