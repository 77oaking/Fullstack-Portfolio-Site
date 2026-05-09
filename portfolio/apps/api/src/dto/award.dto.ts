import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateAwardDto {
  @IsString() title!: string;
  @IsString() issuer!: string;
  @IsDateString() date!: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsInt() @Min(0) order?: number;
  @IsOptional() @IsBoolean() visible?: boolean;
}

export class UpdateAwardDto extends PartialType(CreateAwardDto) {}
