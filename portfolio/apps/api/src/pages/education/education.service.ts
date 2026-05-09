import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import { EducationDoc } from '../../schema/education.schema';

@Injectable()
export class EducationService extends CrudService<EducationDoc> {
  constructor(@InjectModel('Education') model: Model<EducationDoc>) {
    super(model, 'Education');
  }
}
