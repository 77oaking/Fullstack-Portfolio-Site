import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { UpsertAboutDto } from '../../dto/about.dto';
import { AboutService } from './about.service';

@ApiTags('about')
@Controller('about')
export class AboutController {
  constructor(private readonly service: AboutService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create or update the about section' })
  upsert(@Body() dto: UpsertAboutDto) {
    return this.service.upsert(dto as unknown as Record<string, unknown>);
  }
}
