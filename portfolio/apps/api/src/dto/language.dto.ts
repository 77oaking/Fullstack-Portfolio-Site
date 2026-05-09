import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export type LanguageProficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';

export class CreateLanguageDto {
  @IsString() name!: string;
  @IsEnum(['native', 'fluent', 'advanced', 'intermediate', 'basic']) proficiency!: LanguageProficiency;
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {}
