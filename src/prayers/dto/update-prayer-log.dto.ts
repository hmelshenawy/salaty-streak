import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PrayerStatus } from '@prisma/client';

export class UpdatePrayerLogDto {
  @IsEnum(PrayerStatus)
  @IsOptional()
  status?: PrayerStatus;

  @IsBoolean()
  @IsOptional()
  inMosque?: boolean;

  @IsDateString()
  @IsOptional()
  prayedAt?: string;
}