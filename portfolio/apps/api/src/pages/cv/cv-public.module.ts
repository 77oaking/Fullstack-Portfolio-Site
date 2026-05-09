import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CvPersonalSchema } from '../../schema/cv-personal.schema';
import { CvSummarySchema } from '../../schema/cv-summary.schema';
import { ExperienceSchema } from '../../schema/experience.schema';
import { EducationSchema } from '../../schema/education.schema';
import { SkillSchema } from '../../schema/skill.schema';
import { LanguageSchema } from '../../schema/language.schema';
import { CertificationSchema } from '../../schema/certification.schema';
import { AwardSchema } from '../../schema/award.schema';
import { CvReferenceSchema } from '../../schema/cv-reference.schema';
import { CvPublicController } from './cv-public.controller';
import { CvPublicService } from './cv-public.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CvPersonal', schema: CvPersonalSchema },
      { name: 'CvSummary', schema: CvSummarySchema },
      { name: 'Experience', schema: ExperienceSchema },
      { name: 'Education', schema: EducationSchema },
      { name: 'Skill', schema: SkillSchema },
      { name: 'Language', schema: LanguageSchema },
      { name: 'Certification', schema: CertificationSchema },
      { name: 'Award', schema: AwardSchema },
      { name: 'CvReference', schema: CvReferenceSchema },
    ]),
  ],
  controllers: [CvPublicController],
  providers: [CvPublicService],
})
export class CvPublicModule {}
