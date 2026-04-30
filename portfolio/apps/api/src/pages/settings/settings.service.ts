import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { Settings } from '../../schema/settings.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { UpdateSettingsDto } from '../../dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(@InjectModel('Settings') private readonly model: Model<Settings>) {}

  async get(): Promise<ResponsePayload> {
    const settings = await this.model.findOne().lean();
    if (!settings) throw new NotFoundException('Settings not initialized — run npm run seed');
    return { success: true, data: settings };
  }

  async update(dto: UpdateSettingsDto): Promise<ResponsePayload> {
    const settings = await this.model.findOneAndUpdate({}, { $set: dto }, {
      new: true,
      upsert: true,
    }).lean();
    return { success: true, message: 'Settings updated', data: settings };
  }
}
