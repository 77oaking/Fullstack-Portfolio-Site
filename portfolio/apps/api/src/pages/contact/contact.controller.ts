import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Ip,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { ContactMessageDto, UpdateContactMessageDto } from '../../dto/contact.dto';
import { ContactService } from './contact.service';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Post()
  @Throttle({ default: { ttl: 60 * 60 * 1000, limit: 5 } })
  @ApiOperation({ summary: 'Submit a contact-form message (rate-limited 5/hour/IP)' })
  submit(
    @Body() dto: ContactMessageDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.service.submit(dto, ip, userAgent ?? '');
  }

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'List all contact messages (admin)' })
  list() {
    return this.service.list();
  }

  @Get(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateContactMessageDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
