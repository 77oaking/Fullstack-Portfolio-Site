import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
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
import { ContactModule } from '../contact/contact.module';
import { SettingsModule } from '../settings/settings.module';

import { AdminOpsController } from './admin-ops.controller';
import { AdminOpsService } from './admin-ops.service';

@Module({
  imports: [
    AuthModule,
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
    ContactModule,
    SettingsModule,
  ],
  controllers: [AdminOpsController],
  providers: [AdminOpsService],
})
export class AdminOpsModule {}
