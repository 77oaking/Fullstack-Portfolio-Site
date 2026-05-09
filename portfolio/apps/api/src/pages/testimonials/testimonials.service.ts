import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import { TestimonialDoc } from '../../schema/testimonial.schema';

@Injectable()
export class TestimonialsService extends CrudService<TestimonialDoc> {
  constructor(@InjectModel('Testimonial') model: Model<TestimonialDoc>) {
    super(model, 'Testimonial');
  }
}
