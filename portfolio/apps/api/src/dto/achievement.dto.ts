import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateAchievementDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {}
