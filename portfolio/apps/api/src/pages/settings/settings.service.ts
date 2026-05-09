import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SingletonService } from '../../common/singleton.service';
import { SettingsDoc } from '../../schema/settings.schema';

@Injectable()
export class SettingsService extends SingletonService<SettingsDoc> {
  constructor(@InjectModel('Settings') model: Model<SettingsDoc>) {
    super(model, 'Settings');
  }
}
