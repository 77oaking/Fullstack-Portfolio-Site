import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { CvSummarySchema } from '../../schema/cv-summary.schema';
import { CvSummaryController } from './cv-summary.controller';
import { CvSummaryService } from './cv-summary.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'CvSummary', schema: CvSummarySchema }]),
  ],
  controllers: [CvSummaryController],
  providers: [CvSummaryService],
})
export class CvSummaryModule {}
