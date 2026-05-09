import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { CvPersonalSchema } from '../../schema/cv-personal.schema';
import { CvPersonalController } from './cv-personal.controller';
import { CvPersonalService } from './cv-personal.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'CvPersonal', schema: CvPersonalSchema }]),
  ],
  controllers: [CvPersonalController],
  providers: [CvPersonalService],
})
export class CvPersonalModule {}
