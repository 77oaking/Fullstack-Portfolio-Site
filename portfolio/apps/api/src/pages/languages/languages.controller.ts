import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateLanguageDto, UpdateLanguageDto } from '../../dto/language.dto';
import { LanguagesService } from './languages.service';

@ApiTags('languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly service: LanguagesService) {}

  @Get()
  @ApiOperation({ summary: 'List all languages' })
  list() {
    return this.service.findAllPublic();
  }

  @Get('admin/all')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'List all languages (admin)' })
  listAdmin() {
    return this.service.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Get language by id (admin)' })
  getById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create a language entry (admin)' })
  create(@Body() dto: CreateLanguageDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Update a language entry (admin)' })
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateLanguageDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Delete a language entry (admin)' })
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
