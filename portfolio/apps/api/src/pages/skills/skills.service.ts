import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { Skill } from '../../schema/skill.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { CreateSkillDto, UpdateSkillDto } from '../../dto/skill.dto';

@Injectable()
export class SkillsService {
  constructor(@InjectModel('Skill') private readonly model: Model<Skill>) {}

  async findAllPublic(): Promise<ResponsePayload> {
    const data = await this.model.find({ visible: true }).sort({ order: 1, name: 1 }).lean();
    return { success: true, data, count: data.length };
  }

  async grouped(): Promise<ResponsePayload> {
    const data = await this.model.find({ visible: true }).sort({ order: 1 }).lean();
    const grouped: Record<string, typeof data> = {};
    for (const s of data) {
      (grouped[s.category] ||= []).push(s);
    }
    return { success: true, data: grouped };
  }

  async create(dto: CreateSkillDto): Promise<ResponsePayload> {
    const doc = await this.model.create(dto);
    return { success: true, message: 'Skill created', data: { _id: doc._id } };
  }

  async update(id: string, dto: UpdateSkillDto): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException('Skill not found');
    return { success: true, message: 'Skill updated', data: doc };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Skill not found');
    return { success: true, message: 'Skill deleted' };
  }
}
