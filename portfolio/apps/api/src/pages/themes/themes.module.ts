import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ThemeSchema } from '../../schema/theme.schema';
import { SettingsSchema } from '../../schema/settings.schema';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Theme', schema: ThemeSchema },
      { name: 'Settings', schema: SettingsSchema },
    ]),
  ],
  controllers: [ThemesController],
  providers: [ThemesService],
  exports: [ThemesService],
})
export class ThemesModule {}
