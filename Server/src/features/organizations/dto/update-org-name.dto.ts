import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateOrgNameDto {
  @ApiProperty({ example: 'New Company Name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;
}
