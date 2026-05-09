import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { CertificationSchema } from '../../schema/certification.schema';
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Certification', schema: CertificationSchema }]),
  ],
  controllers: [CertificationsController],
  providers: [CertificationsService],
  exports: [CertificationsService, MongooseModule],
})
export class CertificationsModule {}
