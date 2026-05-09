import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { ProfileDoc } from '../../schema/profile.schema';
import { HeroDoc } from '../../schema/hero.schema';
import { AboutDoc } from '../../schema/about.schema';
import { ExperienceDoc } from '../../schema/experience.schema';
import { EducationDoc } from '../../schema/education.schema';
import { SkillCategoryDoc } from '../../schema/skill-category.schema';
import { ProjectDoc } from '../../schema/project.schema';
import { ServiceDoc } from '../../schema/service.schema';
import { TestimonialDoc } from '../../schema/testimonial.schema';
import { CertificationDoc } from '../../schema/certification.schema';
import { AchievementDoc } from '../../schema/achievement.schema';
import { BlogPostDoc } from '../../schema/blog-post.schema';
import { SettingsDoc } from '../../schema/settings.schema';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<ProfileDoc>,
    @InjectModel('Hero') private readonly heroModel: Model<HeroDoc>,
    @InjectModel('About') private readonly aboutModel: Model<AboutDoc>,
    @InjectModel('Experience') private readonly experienceModel: Model<ExperienceDoc>,
    @InjectModel('Education') private readonly educationModel: Model<EducationDoc>,
    @InjectModel('SkillCategory') private readonly skillCategoryModel: Model<SkillCategoryDoc>,
    @InjectModel('Project') private readonly projectModel: Model<ProjectDoc>,
    @InjectModel('Service') private readonly serviceModel: Model<ServiceDoc>,
    @InjectModel('Testimonial') private readonly testimonialModel: Model<TestimonialDoc>,
    @InjectModel('Certification') private readonly certificationModel: Model<CertificationDoc>,
    @InjectModel('Achievement') private readonly achievementModel: Model<AchievementDoc>,
    @InjectModel('BlogPost') private readonly blogPostModel: Model<BlogPostDoc>,
    @InjectModel('Settings') private readonly settingsModel: Model<SettingsDoc>,
  ) {}

  async getBundle(): Promise<ResponsePayload> {
    const [
      profile,
      hero,
      about,
      experiences,
      educations,
      skillCategories,
      projects,
      services,
      testimonials,
      certifications,
      achievements,
      blogPosts,
      settings,
    ] = await Promise.all([
      this.profileModel.findOne().lean(),
      this.heroModel.findOne().lean(),
      this.aboutModel.findOne().lean(),
      this.experienceModel.find().sort({ order: 1, startDate: -1 }).lean(),
      this.educationModel.find().sort({ order: 1, startDate: -1 }).lean(),
      this.skillCategoryModel.find().sort({ order: 1, name: 1 }).lean(),
      this.projectModel.find({ status: { $ne: 'archived' } })
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .lean(),
      this.serviceModel.find().sort({ order: 1 }).lean(),
      this.testimonialModel.find().sort({ order: 1, createdAt: -1 }).lean(),
      this.certificationModel.find().sort({ order: 1, issueDate: -1 }).lean(),
      this.achievementModel.find().sort({ order: 1, date: -1 }).lean(),
      this.blogPostModel.find({ published: true })
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean(),
      this.settingsModel.findOne().lean(),
    ]);

    return {
      success: true,
      data: {
        profile: profile ?? null,
        hero: hero ?? null,
        about: about ?? null,
        experiences,
        educations,
        skillCategories,
        projects,
        services,
        testimonials,
        certifications,
        achievements,
        blogPosts,
        settings: settings ?? null,
      },
    };
  }
}
