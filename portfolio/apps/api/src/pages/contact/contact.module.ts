import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from '../auth/auth.module';
import { ContactMessageSchema } from '../../schema/contact-message.schema';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'ContactMessage', schema: ContactMessageSchema }]),
  ],
  controllers: [ContactController],
  providers: [
    ContactService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [ContactService, MongooseModule],
})
export class ContactModule {}
