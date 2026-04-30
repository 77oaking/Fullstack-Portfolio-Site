import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateExperienceDto {
  @IsString() role!: string;
  @IsString() company!: string;
  @IsOptional() @IsString() companyLogo?: string | null;
  @IsOptional() @IsString() location?: string;
  @IsDateString() startDate!: string;
  @IsOptional() @IsDateString() endDate?: string | null;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) bullets?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) techStack?: string[];
  @IsOptional() @IsInt() @Min(0) order?: number;
  @IsOptional() @IsBoolean() visible?: boolean;
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
