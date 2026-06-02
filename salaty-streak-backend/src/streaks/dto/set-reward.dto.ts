import { IsString, MaxLength } from 'class-validator';

export class SetRewardDto {
  @IsString()
  @MaxLength(200)
  reward!: string;
}