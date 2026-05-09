import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class HeroMetricDto {
  @IsString() value!: string;
  @IsString() label!: string;
}

export class UpsertHeroDto {
  @IsOptional() @IsString() badge?: string;
  @IsString() headline!: string;
  @IsOptional() @IsString() subhead?: string;
  @IsOptional() @IsString() primaryCtaLabel?: string;
  @IsOptional() @IsString() primaryCtaUrl?: string;
  @IsOptional() @IsString() secondaryCtaLabel?: string;
  @IsOptional() @IsString() secondaryCtaUrl?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => HeroMetricDto)
  metrics?: HeroMetricDto[];
  @IsOptional() @IsArray() @IsString({ each: true }) techMarquee?: string[];
}

export class UpdateHeroDto extends PartialType(UpsertHeroDto) {}
