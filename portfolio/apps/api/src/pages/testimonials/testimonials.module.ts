import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { TestimonialSchema } from '../../schema/testimonial.schema';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Testimonial', schema: TestimonialSchema }]),
  ],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService, MongooseModule],
})
export class TestimonialsModule {}
