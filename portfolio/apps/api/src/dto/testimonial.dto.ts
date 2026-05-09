import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @IsString() name!: string;
  @IsString() role!: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsString() quote!: string;
  @IsOptional() @IsNumber() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
