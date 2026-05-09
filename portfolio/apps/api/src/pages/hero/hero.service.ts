import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SingletonService } from '../../common/singleton.service';
import { HeroDoc } from '../../schema/hero.schema';

@Injectable()
export class HeroService extends SingletonService<HeroDoc> {
  constructor(@InjectModel('Hero') model: Model<HeroDoc>) {
    super(model, 'Hero');
  }
}
