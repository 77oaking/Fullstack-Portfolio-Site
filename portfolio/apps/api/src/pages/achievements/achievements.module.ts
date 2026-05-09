import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { AchievementSchema } from '../../schema/achievement.schema';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Achievement', schema: AchievementSchema }]),
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService, MongooseModule],
})
export class AchievementsModule {}
