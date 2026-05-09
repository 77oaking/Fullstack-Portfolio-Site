import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { UpsertHeroDto } from '../../dto/hero.dto';
import { HeroService } from './hero.service';

@ApiTags('hero')
@Controller('hero')
export class HeroController {
  constructor(private readonly service: HeroService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create or update the hero section' })
  upsert(@Body() dto: UpsertHeroDto) {
    return this.service.upsert(dto as unknown as Record<string, unknown>);
  }
}
