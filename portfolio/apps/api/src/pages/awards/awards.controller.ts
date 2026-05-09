import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateAwardDto, UpdateAwardDto } from '../../dto/award.dto';
import { AwardsService } from './awards.service';

@ApiTags('awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly service: AwardsService) {}

  @Get()
  @ApiOperation({ summary: 'List visible awards' })
  list() {
    return this.service.findAllPublic();
  }

  @Get('admin/all')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'List all awards (admin)' })
  listAdmin() {
    return this.service.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Get award by id (admin)' })
  getById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create an award (admin)' })
  create(@Body() dto: CreateAwardDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Update an award (admin)' })
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateAwardDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Delete an award (admin)' })
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
