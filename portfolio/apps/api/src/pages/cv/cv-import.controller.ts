import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { ApplyCvImportDto, ParseCvInputDto } from '../../dto/cv-import.dto';
import { CvImportService } from './cv-import.service';

@ApiTags('cv/import')
@Controller('cv/import')
@UseGuards(AdminJwtAuthGuard)
@ApiSecurity('admin')
export class CvImportController {
  constructor(private readonly service: CvImportService) {}

  @Post('parse')
  @ApiOperation({ summary: 'Parse resume text into structured CV sections (admin)' })
  async parse(@Body() dto: ParseCvInputDto) {
    return this.service.parseWithEngine(dto.text ?? '', dto.parserEngine ?? 'basic');
  }

  @Post('apply')
  @ApiOperation({ summary: 'Parse and apply resume data into CV collections (admin)' })
  apply(@Body() dto: ApplyCvImportDto) {
    return this.service.apply(dto.text, dto.mode ?? 'replace', dto.parserEngine ?? 'basic');
  }
}
