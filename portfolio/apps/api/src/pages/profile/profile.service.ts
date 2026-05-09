import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SingletonService } from '../../common/singleton.service';
import { ProfileDoc } from '../../schema/profile.schema';

@Injectable()
export class ProfileService extends SingletonService<ProfileDoc> {
  constructor(@InjectModel('Profile') model: Model<ProfileDoc>) {
    super(model, 'Profile');
  }
}
