import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill.dto';
import { SkillsService } from './skills.service';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'List visible skills' })
  list() {
    return this.service.findAllPublic();
  }

  @Get('grouped')
  @ApiOperation({ summary: 'List visible skills grouped by category' })
  grouped() {
    return this.service.grouped();
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  create(@Body() dto: CreateSkillDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateSkillDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
