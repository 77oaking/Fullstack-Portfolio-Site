import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class SocialLinkDto {
  @IsString() platform!: string;
  @IsString() label!: string;
  @IsString() url!: string;
  @IsOptional() @IsString() icon?: string;
}

export class UpsertProfileDto {
  @IsString() fullName!: string;
  @IsString() shortName!: string;
  @IsString() title!: string;
  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() shortBio?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() resumeUrl?: string;
  @IsOptional() @IsString() location?: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsInt() @Min(0) @Max(80) yearsOfExperience?: number;
  @IsOptional() @IsBoolean() availableForWork?: boolean;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SocialLinkDto)
  socials?: SocialLinkDto[];
  @IsOptional() @IsArray() @IsString({ each: true }) highlights?: string[];
}

export class UpdateProfileDto extends PartialType(UpsertProfileDto) {}
