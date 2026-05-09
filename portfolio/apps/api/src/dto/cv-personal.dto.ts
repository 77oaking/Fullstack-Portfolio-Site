import { IsEmail, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateCvPersonalBaseDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() headline?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() website?: string | null;
  @IsOptional() @IsString() linkedin?: string | null;
  @IsOptional() @IsString() github?: string | null;
  @IsOptional() @IsString() photo?: string | null;
}

export class UpdateCvPersonalDto extends PartialType(UpdateCvPersonalBaseDto) {}
