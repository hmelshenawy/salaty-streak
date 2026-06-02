import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PrayerName, PrayerStatus } from '@prisma/client';

export class CreatePrayerLogDto {
  @IsEnum(PrayerName)
  prayerName!: PrayerName;

  @IsEnum(PrayerStatus)
  status!: PrayerStatus;

  @IsBoolean()
  @IsOptional()
  inMosque?: boolean;

  @IsDateString()
  date!: string;

  @IsDateString()
  @IsOptional()
  prayedAt?: string;
}