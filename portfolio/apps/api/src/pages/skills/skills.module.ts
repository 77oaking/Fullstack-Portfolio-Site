import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SkillSchema } from '../../schema/skill.schema';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: 'Skill', schema: SkillSchema }])],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
