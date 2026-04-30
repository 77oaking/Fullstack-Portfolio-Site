import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SettingsSchema } from '../../schema/settings.schema';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: 'Settings', schema: SettingsSchema }])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
