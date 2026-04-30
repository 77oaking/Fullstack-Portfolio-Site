import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactMessageDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(2) @MaxLength(120) subject!: string;
  @IsString() @MinLength(2) @MaxLength(4000) message!: string;

  // honeypot — must be empty; non-empty is silently rejected as bot.
  @IsOptional() @IsString() honeypot?: string;
}
