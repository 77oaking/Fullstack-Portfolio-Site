import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { CvSummary } from '../../schema/cv-summary.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { UpdateCvSummaryDto } from '../../dto/cv-summary.dto';

@Injectable()
export class CvSummaryService {
  constructor(@InjectModel('CvSummary') private readonly model: Model<CvSummary>) {}

  async get(): Promise<ResponsePayload> {
    const data = await this.model.findOne().lean();
    return { success: true, data: data ?? null };
  }

  async update(dto: UpdateCvSummaryDto): Promise<ResponsePayload> {
    const data = await this.model
      .findOneAndUpdate({}, { $set: dto }, { new: true, upsert: true })
      .lean();
    return { success: true, message: 'Summary updated', data };
  }
}
