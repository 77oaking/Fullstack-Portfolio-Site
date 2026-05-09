import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @IsString() @MaxLength(200) title!: string;
  @IsString() @MaxLength(200) slug!: string;
  @IsOptional() @IsString() @MaxLength(320) excerpt?: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() publishedAt?: string;
  @IsOptional() @IsInt() @Min(0) readingMinutes?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}
