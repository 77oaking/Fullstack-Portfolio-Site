import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import { ServiceDoc } from '../../schema/service.schema';

@Injectable()
export class ServicesService extends CrudService<ServiceDoc> {
  constructor(@InjectModel('Service') model: Model<ServiceDoc>) {
    super(model, 'Service');
  }
}
