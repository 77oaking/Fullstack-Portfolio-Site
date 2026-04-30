import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { Experience } from '../../schema/experience.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { CreateExperienceDto, UpdateExperienceDto } from '../../dto/experience.dto';

@Injectable()
export class ExperienceService {
  constructor(@InjectModel('Experience') private readonly model: Model<Experience>) {}

  async findAllPublic(): Promise<ResponsePayload> {
    const data = await this.model.find({ visible: true }).sort({ startDate: -1 }).lean();
    return { success: true, data, count: data.length };
  }

  async create(dto: CreateExperienceDto): Promise<ResponsePayload> {
    const doc = await this.model.create(dto);
    return { success: true, message: 'Experience created', data: { _id: doc._id } };
  }

  async update(id: string, dto: UpdateExperienceDto): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException('Experience not found');
    return { success: true, message: 'Experience updated', data: doc };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Experience not found');
    return { success: true, message: 'Experience deleted' };
  }
}
