import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrgDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
