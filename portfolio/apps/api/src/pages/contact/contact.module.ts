import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ContactMessageSchema } from '../../schema/contact-message.schema';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ContactMessage', schema: ContactMessageSchema }]),
  ],
  controllers: [ContactController],
  providers: [
    ContactService,
    // Apply throttling globally — 60 req/minute by default. Contact form has its own tighter limit.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class ContactModule {}
