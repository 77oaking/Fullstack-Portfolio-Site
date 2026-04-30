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
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FilterAndPaginationDto } from './common/filter.dto';

class ProjectLinkDto {
  @IsString() label!: string;
  @IsString() url!: string;
}

export class CreateProjectDto {
  @IsString() @MaxLength(120) title!: string;
  @IsString() @MaxLength(120) slug!: string;
  @IsString() @MaxLength(280) summary!: string;
  @IsString() description!: string;
  @IsString() coverImage!: string;

  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(20) gallery?: string[];

  @IsArray() @IsString({ each: true }) @ArrayMaxSize(10) tags!: string[];
  @IsArray() @IsString({ each: true }) @ArrayMaxSize(20) techStack!: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectLinkDto)
  links?: ProjectLinkDto[];

  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() @Min(0) order?: number;

  @IsIn(['draft', 'published', 'archived'])
  status!: 'draft' | 'published' | 'archived';
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class ProjectFilterDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() q?: string; // free-text search on title/summary
}

export class FilterAndPaginationProjectDto extends FilterAndPaginationDto<ProjectFilterDto> {}

export class ReorderDto {
  @IsArray() @IsString({ each: true }) ids!: string[];
}
