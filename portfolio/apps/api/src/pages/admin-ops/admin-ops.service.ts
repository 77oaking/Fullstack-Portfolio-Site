import { Injectable, Logger } from '@nestjs/common';
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
import { ContactMessageDoc } from '../../schema/contact-message.schema';
import { SettingsDoc } from '../../schema/settings.schema';

@Injectable()
export class AdminOpsService {
  private readonly logger = new Logger(AdminOpsService.name);

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
    @InjectModel('ContactMessage') private readonly contactModel: Model<ContactMessageDoc>,
    @InjectModel('Settings') private readonly settingsModel: Model<SettingsDoc>,
  ) {}

  /**
   * Wipes every portfolio collection. The admin user record is intentionally
   * preserved so the operator stays logged in.
   */
  async resetAll(): Promise<ResponsePayload> {
    type Wipeable = { deleteMany: (filter: Record<string, unknown>) => Promise<{ deletedCount?: number }> };
    const targets: { name: string; model: Wipeable }[] = [
      { name: 'profile', model: this.profileModel as unknown as Wipeable },
      { name: 'hero', model: this.heroModel as unknown as Wipeable },
      { name: 'about', model: this.aboutModel as unknown as Wipeable },
      { name: 'experiences', model: this.experienceModel as unknown as Wipeable },
      { name: 'educations', model: this.educationModel as unknown as Wipeable },
      { name: 'skillCategories', model: this.skillCategoryModel as unknown as Wipeable },
      { name: 'projects', model: this.projectModel as unknown as Wipeable },
      { name: 'services', model: this.serviceModel as unknown as Wipeable },
      { name: 'testimonials', model: this.testimonialModel as unknown as Wipeable },
      { name: 'certifications', model: this.certificationModel as unknown as Wipeable },
      { name: 'achievements', model: this.achievementModel as unknown as Wipeable },
      { name: 'blogPosts', model: this.blogPostModel as unknown as Wipeable },
      { name: 'contactMessages', model: this.contactModel as unknown as Wipeable },
      { name: 'settings', model: this.settingsModel as unknown as Wipeable },
    ];

    const wiped: Record<string, number> = {};
    for (const t of targets) {
      const result = await t.model.deleteMany({});
      wiped[t.name] = result.deletedCount ?? 0;
    }
    this.logger.warn(`Portfolio reset complete: ${JSON.stringify(wiped)}`);

    return {
      success: true,
      message: 'All portfolio data has been wiped. Admin user preserved.',
      data: wiped,
    };
  }
}
