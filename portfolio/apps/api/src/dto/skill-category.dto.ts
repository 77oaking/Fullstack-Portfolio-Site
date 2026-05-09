import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class SkillItemDto {
  @IsString() name!: string;
  @IsOptional() @IsNumber() @Min(0) @Max(100) level?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(80) yearsOfExperience?: number;
  @IsOptional() @IsString() icon?: string;
}

export class CreateSkillCategoryDto {
  @IsString() name!: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() @Min(0) order?: number;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SkillItemDto)
  items?: SkillItemDto[];
}

export class UpdateSkillCategoryDto extends PartialType(CreateSkillCategoryDto) {}
