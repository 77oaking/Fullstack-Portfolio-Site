import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';

import { AuthModule } from './pages/auth/auth.module';
import { ProjectsModule } from './pages/projects/projects.module';
import { SkillsModule } from './pages/skills/skills.module';
import { ExperienceModule } from './pages/experience/experience.module';
import { ThemesModule } from './pages/themes/themes.module';
import { SettingsModule } from './pages/settings/settings.module';
import { ContactModule } from './pages/contact/contact.module';

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
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    AuthModule,
    ProjectsModule,
    SkillsModule,
    ExperienceModule,
    ThemesModule,
    SettingsModule,
    ContactModule,
  ],
})
export class AppModule {}
