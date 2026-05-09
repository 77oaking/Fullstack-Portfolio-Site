import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { Language } from '../../schema/language.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { CreateLanguageDto, UpdateLanguageDto } from '../../dto/language.dto';

@Injectable()
export class LanguagesService {
  constructor(@InjectModel('Language') private readonly model: Model<Language>) {}

  async findAllPublic(): Promise<ResponsePayload> {
    const data = await this.model.find().sort({ order: 1, name: 1 }).lean();
    return { success: true, data, count: data.length };
  }

  async findAllAdmin(): Promise<ResponsePayload> {
    const data = await this.model.find().sort({ order: 1, name: 1 }).lean();
    return { success: true, data, count: data.length };
  }

  async findById(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException('Language not found');
    return { success: true, data: doc };
  }

  async create(dto: CreateLanguageDto): Promise<ResponsePayload> {
    const doc = await this.model.create(dto);
    return { success: true, message: 'Language created', data: { _id: doc._id } };
  }

  async update(id: string, dto: UpdateLanguageDto): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException('Language not found');
    return { success: true, message: 'Language updated', data: doc };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Language not found');
    return { success: true, message: 'Language deleted' };
  }
}
