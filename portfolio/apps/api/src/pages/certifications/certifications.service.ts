import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import { CertificationDoc } from '../../schema/certification.schema';

@Injectable()
export class CertificationsService extends CrudService<CertificationDoc> {
  constructor(@InjectModel('Certification') model: Model<CertificationDoc>) {
    super(model, 'Certification');
  }
}
