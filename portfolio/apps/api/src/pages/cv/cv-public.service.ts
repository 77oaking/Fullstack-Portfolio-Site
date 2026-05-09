import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import type { CvPersonal } from '../../schema/cv-personal.schema';
import type { CvSummary } from '../../schema/cv-summary.schema';
import type { ExperienceDoc } from '../../schema/experience.schema';
import type { EducationDoc } from '../../schema/education.schema';
import type { Skill } from '../../schema/skill.schema';
import type { Language } from '../../schema/language.schema';
import type { CertificationDoc } from '../../schema/certification.schema';
import type { Award } from '../../schema/award.schema';
import type { CvReference } from '../../schema/cv-reference.schema';

@Injectable()
export class CvPublicService {
  constructor(
    @InjectModel('CvPersonal') private readonly personalModel: Model<CvPersonal>,
    @InjectModel('CvSummary') private readonly summaryModel: Model<CvSummary>,
    @InjectModel('Experience') private readonly experienceModel: Model<ExperienceDoc>,
    @InjectModel('Education') private readonly educationModel: Model<EducationDoc>,
    @InjectModel('Skill') private readonly skillModel: Model<Skill>,
    @InjectModel('Language') private readonly languageModel: Model<Language>,
    @InjectModel('Certification') private readonly certificationModel: Model<CertificationDoc>,
    @InjectModel('Award') private readonly awardModel: Model<Award>,
    @InjectModel('CvReference') private readonly referenceModel: Model<CvReference>,
  ) {}

  async getPublicCv(): Promise<ResponsePayload> {
    const [
      personal,
      summary,
      experience,
      education,
      skills,
      languages,
      certifications,
      awards,
      references,
    ] = await Promise.all([
      this.personalModel.findOne().lean(),
      this.summaryModel.findOne().lean(),
      this.experienceModel.find({ visible: true }).sort({ order: 1, startDate: -1, createdAt: -1 }).lean(),
      this.educationModel.find({ visible: true }).sort({ order: 1, startDate: -1, createdAt: -1 }).lean(),
      this.skillModel.find({ visible: true }).sort({ order: 1, name: 1 }).lean(),
      this.languageModel.find().sort({ order: 1, name: 1 }).lean(),
      this.certificationModel.find({ visible: true }).sort({ order: 1, issueDate: -1, createdAt: -1 }).lean(),
      this.awardModel.find({ visible: true }).sort({ order: 1, date: -1, createdAt: -1 }).lean(),
      this.referenceModel.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    return {
      success: true,
      data: {
        personal: personal ?? null,
        summary: summary ?? null,
        experience,
        education,
        skills,
        languages,
        certifications,
        awards,
        references,
      },
    };
  }
}
