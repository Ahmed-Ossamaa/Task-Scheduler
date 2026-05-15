import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetOrgsQueryDto {
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
}
