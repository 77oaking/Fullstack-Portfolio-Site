import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';

import { AuthModule } from './pages/auth/auth.module';
import { ProfileModule } from './pages/profile/profile.module';
import { HeroModule } from './pages/hero/hero.module';
import { AboutModule } from './pages/about/about.module';
import { ExperienceModule } from './pages/experience/experience.module';
import { EducationModule } from './pages/education/education.module';
import { SkillsModule } from './pages/skills/skills.module';
import { ProjectsModule } from './pages/projects/projects.module';
import { ServicesModule } from './pages/services/services.module';
import { TestimonialsModule } from './pages/testimonials/testimonials.module';
import { CertificationsModule } from './pages/certifications/certifications.module';
import { AchievementsModule } from './pages/achievements/achievements.module';
import { BlogModule } from './pages/blog/blog.module';
import { ContactModule } from './pages/contact/contact.module';
import { SettingsModule } from './pages/settings/settings.module';
import { PortfolioModule } from './pages/portfolio/portfolio.module';
import { AdminOpsModule } from './pages/admin-ops/admin-ops.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongoUri'),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),

    // Auth
    AuthModule,

    // Singletons
    ProfileModule,
    HeroModule,
    AboutModule,
    SettingsModule,

    // Collections
    ExperienceModule,
    EducationModule,
    SkillsModule,
    ProjectsModule,
    ServicesModule,
    TestimonialsModule,
    CertificationsModule,
    AchievementsModule,
    BlogModule,

    // Public
    ContactModule,
    PortfolioModule,

    // Ops
    AdminOpsModule,
  ],
})
export class AppModule {}
