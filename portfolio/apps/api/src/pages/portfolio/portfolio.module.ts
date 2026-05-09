import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile/profile.module';
import { HeroModule } from '../hero/hero.module';
import { AboutModule } from '../about/about.module';
import { ExperienceModule } from '../experience/experience.module';
import { EducationModule } from '../education/education.module';
import { SkillsModule } from '../skills/skills.module';
import { ProjectsModule } from '../projects/projects.module';
import { ServicesModule } from '../services/services.module';
import { TestimonialsModule } from '../testimonials/testimonials.module';
import { CertificationsModule } from '../certifications/certifications.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { BlogModule } from '../blog/blog.module';
import { SettingsModule } from '../settings/settings.module';

import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    ProfileModule,
    HeroModule,
    AboutModule,
    ExperienceModule,
    EducationModule,
    SkillsModule,
    ProjectsModule,
    ServicesModule,
    TestimonialsModule,
    CertificationsModule,
    AchievementsModule,
    BlogModule,
    SettingsModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
