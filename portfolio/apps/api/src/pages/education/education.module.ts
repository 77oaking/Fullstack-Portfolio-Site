import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { EducationSchema } from '../../schema/education.schema';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Education', schema: EducationSchema }]),
  ],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService, MongooseModule],
})
export class EducationModule {}
