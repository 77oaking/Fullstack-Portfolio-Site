import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import { ExperienceDoc } from '../../schema/experience.schema';

@Injectable()
export class ExperienceService extends CrudService<ExperienceDoc> {
  constructor(@InjectModel('Experience') model: Model<ExperienceDoc>) {
    super(model, 'Experience');
  }
}
