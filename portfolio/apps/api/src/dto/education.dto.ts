import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateEducationDto {
  @IsString() institution!: string;
  @IsOptional() @IsString() institutionUrl?: string;
  @IsOptional() @IsString() institutionLogo?: string;
  @IsString() degree!: string;
  @IsOptional() @IsString() fieldOfStudy?: string;
  @IsOptional() @IsString() location?: string;
  @IsString() startDate!: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsBoolean() current?: boolean;
  @IsOptional() @IsString() gpa?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) achievements?: string[];
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}
