import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { GetAdmin, AdminPrincipal } from '../../decorator/get-admin.decorator';
import { AdminLoginDto, ChangePasswordDto } from '../../dto/auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('admin')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  login(@Body() dto: AdminLoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Get the currently authenticated admin' })
  me(@GetAdmin() admin: AdminPrincipal) {
    return this.auth.me(admin._id);
  }

  @Post('change-password')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Change the admin password' })
  changePassword(@GetAdmin() admin: AdminPrincipal, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(admin._id, dto);
  }
}
