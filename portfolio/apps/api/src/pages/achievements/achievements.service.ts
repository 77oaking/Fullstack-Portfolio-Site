import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import { AchievementDoc } from '../../schema/achievement.schema';

@Injectable()
export class AchievementsService extends CrudService<AchievementDoc> {
  constructor(@InjectModel('Achievement') model: Model<AchievementDoc>) {
    super(model, 'Achievement');
  }
}
