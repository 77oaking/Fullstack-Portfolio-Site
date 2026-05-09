import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { AwardSchema } from '../../schema/award.schema';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Award', schema: AwardSchema }]),
  ],
  controllers: [AwardsController],
  providers: [AwardsService],
})
export class AwardsModule {}
