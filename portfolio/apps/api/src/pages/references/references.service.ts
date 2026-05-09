import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { CvReference } from '../../schema/cv-reference.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { CreateCvReferenceDto, UpdateCvReferenceDto } from '../../dto/cv-reference.dto';

@Injectable()
export class ReferencesService {
  constructor(@InjectModel('CvReference') private readonly model: Model<CvReference>) {}

  async findAllPublic(): Promise<ResponsePayload> {
    const data = await this.model.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean();
    return { success: true, data, count: data.length };
  }

  async findAllAdmin(): Promise<ResponsePayload> {
    const data = await this.model.find().sort({ order: 1, createdAt: -1 }).lean();
    return { success: true, data, count: data.length };
  }

  async findById(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException('Reference not found');
    return { success: true, data: doc };
  }

  async create(dto: CreateCvReferenceDto): Promise<ResponsePayload> {
    const doc = await this.model.create(dto);
    return { success: true, message: 'Reference created', data: { _id: doc._id } };
  }

  async update(id: string, dto: UpdateCvReferenceDto): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException('Reference not found');
    return { success: true, message: 'Reference updated', data: doc };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Reference not found');
    return { success: true, message: 'Reference deleted' };
  }
}
