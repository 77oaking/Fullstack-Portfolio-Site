import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { UpdateCvSummaryDto } from '../../dto/cv-summary.dto';
import { CvSummaryService } from './cv-summary.service';

@ApiTags('cv/summary')
@Controller('cv/summary')
export class CvSummaryController {
  constructor(private readonly service: CvSummaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get CV professional summary' })
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Update CV professional summary (admin)' })
  update(@Body() dto: UpdateCvSummaryDto) {
    return this.service.update(dto);
  }
}
