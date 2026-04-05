import { IsEnum } from 'class-validator';
import { GrowthInterval } from '../types/analytics.types';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsDto {
  @ApiProperty({
    enum: GrowthInterval,
    example: GrowthInterval.THREE_MONTHS,
    default: GrowthInterval.SIX_MONTHS,
  })
  @IsEnum(GrowthInterval)
  interval: GrowthInterval = GrowthInterval.SIX_MONTHS;
}
