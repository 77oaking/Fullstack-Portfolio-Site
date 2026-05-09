import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { HeroSchema } from '../../schema/hero.schema';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Hero', schema: HeroSchema }]),
  ],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService, MongooseModule],
})
export class HeroModule {}
