import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateExperienceDto, UpdateExperienceDto } from '../../dto/experience.dto';
import { ExperienceService } from './experience.service';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly service: ExperienceService) {}

  @Get()
  @ApiOperation({ summary: 'List visible experience entries' })
  list() {
    return this.service.findAllPublic();
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  create(@Body() dto: CreateExperienceDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateExperienceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
