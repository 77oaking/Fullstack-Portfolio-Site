import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import { SkillCategoryDoc } from '../../schema/skill-category.schema';

@Injectable()
export class SkillsService extends CrudService<SkillCategoryDoc> {
  constructor(@InjectModel('SkillCategory') model: Model<SkillCategoryDoc>) {
    super(model, 'SkillCategory');
  }
}
