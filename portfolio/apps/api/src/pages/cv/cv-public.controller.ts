import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CvPublicService } from './cv-public.service';

@ApiTags('cv')
@Controller('cv')
export class CvPublicController {
  constructor(private readonly service: CvPublicService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get compiled public CV payload' })
  getPublicCv() {
    return this.service.getPublicCv();
  }
}
