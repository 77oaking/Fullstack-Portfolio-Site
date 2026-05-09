import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { Award } from '../../schema/award.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { CreateAwardDto, UpdateAwardDto } from '../../dto/award.dto';

@Injectable()
export class AwardsService {
  constructor(@InjectModel('Award') private readonly model: Model<Award>) {}

  async findAllPublic(): Promise<ResponsePayload> {
    const data = await this.model.find({ visible: true }).sort({ order: 1, date: -1, createdAt: -1 }).lean();
    return { success: true, data, count: data.length };
  }

  async findAllAdmin(): Promise<ResponsePayload> {
    const data = await this.model.find().sort({ order: 1, date: -1, createdAt: -1 }).lean();
    return { success: true, data, count: data.length };
  }

  async findById(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException('Award not found');
    return { success: true, data: doc };
  }

  async create(dto: CreateAwardDto): Promise<ResponsePayload> {
    const doc = await this.model.create(dto);
    return { success: true, message: 'Award created', data: { _id: doc._id } };
  }

  async update(id: string, dto: UpdateAwardDto): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException('Award not found');
    return { success: true, message: 'Award updated', data: doc };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Award not found');
    return { success: true, message: 'Award deleted' };
  }
}
