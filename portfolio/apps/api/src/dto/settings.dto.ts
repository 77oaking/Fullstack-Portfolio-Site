import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpsertSettingsDto {
  @IsOptional() @IsString() siteTitle?: string;
  @IsOptional() @IsString() siteDescription?: string;
  @IsOptional() @IsArray() navItems?: unknown[];
  @IsOptional() @IsObject() footer?: Record<string, unknown>;
  @IsOptional() @IsObject() seo?: Record<string, unknown>;
  @IsOptional() @IsString() activeTheme?: string;
  @IsOptional() @IsObject() features?: Record<string, boolean>;
}

export class UpdateSettingsDto extends PartialType(UpsertSettingsDto) {}
