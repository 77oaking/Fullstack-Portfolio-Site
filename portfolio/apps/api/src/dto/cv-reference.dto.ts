import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCvReferenceDto {
  @IsString() name!: string;
  @IsString() position!: string;
  @IsString() company!: string;
  @IsOptional() @IsEmail() email?: string | null;
  @IsOptional() @IsString() phone?: string | null;
  @IsOptional() @IsString() relationship?: string | null;
  @IsOptional() @IsInt() @Min(0) order?: number;
  @IsOptional() @IsBoolean() visible?: boolean;
}

export class UpdateCvReferenceDto extends PartialType(CreateCvReferenceDto) {}
