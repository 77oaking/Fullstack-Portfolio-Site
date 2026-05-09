import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCertificationDto {
  @IsString() title!: string;
  @IsString() issuer!: string;
  @IsString() issueDate!: string;
  @IsOptional() @IsString() expiryDate?: string;
  @IsOptional() @IsString() credentialId?: string;
  @IsOptional() @IsString() credentialUrl?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateCertificationDto extends PartialType(CreateCertificationDto) {}
