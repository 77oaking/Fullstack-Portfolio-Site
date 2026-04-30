import { IsBoolean, IsIn, IsObject, IsOptional, IsString, Matches } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateThemeDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'themeId must be kebab-case' })
  themeId!: string;

  @IsString() name!: string;
  @IsString() description!: string;
  @IsString() preview!: string;

  @IsIn(['light', 'dark']) mode!: 'light' | 'dark';

  @IsObject() tokens!: Record<string, unknown>; // structural validation lives in joi/theme-engine
  @IsOptional() @IsObject() components?: Record<string, unknown>;

  @IsOptional() @IsBoolean() visible?: boolean;
}

export class UpdateThemeDto extends PartialType(CreateThemeDto) {}
