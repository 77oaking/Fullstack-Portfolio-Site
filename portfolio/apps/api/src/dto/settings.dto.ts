import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

class SocialLinksDto {
  @IsOptional() @IsString() github?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() twitter?: string;
  @IsOptional() @IsString() youtube?: string;
  @IsOptional() @IsObject() other?: { label: string; url: string }[];
}

class SeoMetaDto {
  @IsString() metaTitle!: string;
  @IsString() metaDescription!: string;
  @IsString() ogImage!: string;
}

export class UpdateSettingsCompleteDto {
  @IsString() siteTitle!: string;
  @IsString() siteTagline!: string;
  @IsString() ownerName!: string;
  @IsString() ownerHeadline!: string;
  @IsString() ownerBio!: string;
  @IsString() ownerAvatar!: string;
  @IsOptional() @IsString() resumeUrl?: string | null;
  @IsEmail() contactEmail!: string;
  @ValidateNested() @Type(() => SocialLinksDto) social!: SocialLinksDto;
  @IsString() activeThemeId!: string;
  @ValidateNested() @Type(() => SeoMetaDto) seo!: SeoMetaDto;
}

export class UpdateSettingsDto extends PartialType(UpdateSettingsCompleteDto) {}
