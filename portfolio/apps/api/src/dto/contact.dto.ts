import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ContactMessageDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(2) @MaxLength(160) subject!: string;
  @IsString() @MinLength(2) @MaxLength(4000) message!: string;
  @IsOptional() @IsString() honeypot?: string;
}

export class UpdateContactMessageDto {
  @IsOptional() @IsBoolean() read?: boolean;
  @IsOptional() @IsBoolean() archived?: boolean;
}
