import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SingletonService } from '../../common/singleton.service';
import { AboutDoc } from '../../schema/about.schema';

@Injectable()
export class AboutService extends SingletonService<AboutDoc> {
  constructor(@InjectModel('About') model: Model<AboutDoc>) {
    super(model, 'About');
  }
}
