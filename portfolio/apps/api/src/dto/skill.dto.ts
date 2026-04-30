import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateSkillDto {
  @IsString() name!: string;
  @IsString() category!: string;
  @IsIn([1, 2, 3, 4, 5]) level!: 1 | 2 | 3 | 4 | 5;
  @IsOptional() @IsInt() @Min(0) @Max(60) yearsOfExperience?: number;
  @IsOptional() @IsString() icon?: string | null;
  @IsOptional() @IsInt() @Min(0) order?: number;
  @IsOptional() @IsBoolean() visible?: boolean;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
