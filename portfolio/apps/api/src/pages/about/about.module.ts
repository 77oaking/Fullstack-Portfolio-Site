import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { AboutSchema } from '../../schema/about.schema';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'About', schema: AboutSchema }]),
  ],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService, MongooseModule],
})
export class AboutModule {}
