import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship'] as const;

export class CreateExperienceDto {
  @IsString() role!: string;
  @IsString() company!: string;
  @IsOptional() @IsString() companyUrl?: string;
  @IsOptional() @IsString() companyLogo?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsIn(EMPLOYMENT_TYPES) type?: (typeof EMPLOYMENT_TYPES)[number];
  @IsString() startDate!: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsBoolean() current?: boolean;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) achievements?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) techStack?: string[];
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
