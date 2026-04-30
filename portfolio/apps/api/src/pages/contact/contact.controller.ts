import { Body, Controller, Ip, Post, Headers } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContactMessageDto } from '../../dto/contact.dto';
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
}
