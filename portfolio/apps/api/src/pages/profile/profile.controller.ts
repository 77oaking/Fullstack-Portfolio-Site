import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { UpsertProfileDto } from '../../dto/profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get the public profile (singleton)' })
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create or update the profile' })
  upsert(@Body() dto: UpsertProfileDto) {
    return this.service.upsert(dto as unknown as Record<string, unknown>);
  }
}
