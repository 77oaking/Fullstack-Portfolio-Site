import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
