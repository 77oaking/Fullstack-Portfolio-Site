import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

const PROJECT_STATUSES = ['completed', 'in-progress', 'archived'] as const;

export class CreateProjectDto {
  @IsString() @MaxLength(160) title!: string;
  @IsString() @MaxLength(160) slug!: string;
  @IsOptional() @IsString() @MaxLength(320) summary?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(30) gallery?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(40) techStack?: string[];
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() team?: string;
  @IsOptional() @IsString() liveUrl?: string;
  @IsOptional() @IsString() repoUrl?: string;
  @IsOptional() @IsString() caseStudyUrl?: string;
  @IsOptional() @IsString() startDate?: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsIn(PROJECT_STATUSES) status?: (typeof PROJECT_STATUSES)[number];
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
