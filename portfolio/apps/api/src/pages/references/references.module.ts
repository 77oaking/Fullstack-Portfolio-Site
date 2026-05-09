import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { CvReferenceSchema } from '../../schema/cv-reference.schema';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'CvReference', schema: CvReferenceSchema }]),
  ],
  controllers: [ReferencesController],
  providers: [ReferencesService],
})
export class ReferencesModule {}
