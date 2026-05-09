import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class AboutFactDto {
  @IsString() label!: string;
  @IsString() value!: string;
}

export class UpsertAboutDto {
  @IsOptional() @IsString() heading?: string;
  @IsOptional() @IsString() kicker?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) paragraphs?: string[];
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => AboutFactDto)
  facts?: AboutFactDto[];
  @IsOptional() @IsArray() @IsString({ each: true }) values?: string[];
}

export class UpdateAboutDto extends PartialType(UpsertAboutDto) {}
