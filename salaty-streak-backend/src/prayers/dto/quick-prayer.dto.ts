import { IsBoolean, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { PrayerName } from '@prisma/client';

export class QuickPrayerDto {
  @IsEnum(PrayerName)
  prayerName!: PrayerName;

  @IsDateString()
  date!: string;

  @IsBoolean()
  @IsOptional()
  inMosque?: boolean;
}