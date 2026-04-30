import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { UpdateSettingsDto } from '../../dto/settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get site settings (public)' })
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Update site settings (admin)' })
  update(@Body() dto: UpdateSettingsDto) {
    return this.service.update(dto);
  }
}
