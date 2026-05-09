import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ExperienceSchema } from '../../schema/experience.schema';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Experience', schema: ExperienceSchema }]),
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService, MongooseModule],
})
export class ExperienceModule {}
