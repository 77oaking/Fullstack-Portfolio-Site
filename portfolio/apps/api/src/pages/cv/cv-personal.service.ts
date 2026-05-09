import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { CvPersonal } from '../../schema/cv-personal.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { UpdateCvPersonalDto } from '../../dto/cv-personal.dto';

@Injectable()
export class CvPersonalService {
  constructor(@InjectModel('CvPersonal') private readonly model: Model<CvPersonal>) {}

  async get(): Promise<ResponsePayload> {
    const data = await this.model.findOne().lean();
    return { success: true, data: data ?? null };
  }

  async update(dto: UpdateCvPersonalDto): Promise<ResponsePayload> {
    const data = await this.model
      .findOneAndUpdate({}, { $set: dto }, { new: true, upsert: true })
      .lean();
    return { success: true, message: 'Personal data updated', data };
  }
}
