import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { UpdateCvPersonalDto } from '../../dto/cv-personal.dto';
import { CvPersonalService } from './cv-personal.service';

@ApiTags('cv/personal')
@Controller('cv/personal')
export class CvPersonalController {
  constructor(private readonly service: CvPersonalService) {}

  @Get()
  @ApiOperation({ summary: 'Get CV personal data' })
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Update CV personal data (admin)' })
  update(@Body() dto: UpdateCvPersonalDto) {
    return this.service.update(dto);
  }
}
