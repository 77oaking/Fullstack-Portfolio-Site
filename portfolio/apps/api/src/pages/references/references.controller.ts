import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateCvReferenceDto, UpdateCvReferenceDto } from '../../dto/cv-reference.dto';
import { ReferencesService } from './references.service';

@ApiTags('references')
@Controller('references')
export class ReferencesController {
  constructor(private readonly service: ReferencesService) {}

  @Get()
  @ApiOperation({ summary: 'List visible references' })
  list() {
    return this.service.findAllPublic();
  }

  @Get('admin/all')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'List all references (admin)' })
  listAdmin() {
    return this.service.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Get reference by id (admin)' })
  getById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create a reference (admin)' })
  create(@Body() dto: CreateCvReferenceDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Update a reference (admin)' })
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateCvReferenceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Delete a reference (admin)' })
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
