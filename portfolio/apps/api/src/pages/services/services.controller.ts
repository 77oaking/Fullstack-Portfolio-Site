import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateServiceDto, UpdateServiceDto } from '../../dto/service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Get()
  list() {
    return this.service.findAll({}, { order: 1, createdAt: -1 });
  }

  @Get(':id')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  create(@Body() dto: CreateServiceDto) {
    return this.service.create(dto as unknown as Record<string, unknown>);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateServiceDto) {
    return this.service.update(id, dto as unknown as Record<string, unknown>);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
