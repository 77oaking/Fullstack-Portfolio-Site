import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { Theme } from '../../schema/theme.schema';
import type { Settings } from '../../schema/settings.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { CreateThemeDto, UpdateThemeDto } from '../../dto/theme.dto';

/**
 * Maps a Mongo Theme document to the API/client shape:
 *   { _id, themeId, ... }  -> { _id, id, ... }
 *
 * The Mongo schema uses `themeId` to avoid confusion with `_id`, but shared-types
 * Theme.id is the canonical client field (see docs/THEME_SCHEMA.md).
 */
function toApi(doc: Record<string, unknown>): Record<string, unknown> {
  const { themeId, ...rest } = doc as { themeId?: string } & Record<string, unknown>;
  return { ...rest, id: themeId };
}

@Injectable()
export class ThemesService {
  constructor(
    @InjectModel('Theme') private readonly themes: Model<Theme>,
    @InjectModel('Settings') private readonly settings: Model<Settings>,
  ) {}

  async getActive(): Promise<ResponsePayload> {
    const settings = await this.settings.findOne().lean();
    const themeId = settings?.activeThemeId ?? 'minimal-light';
    const theme = await this.themes.findOne({ themeId, visible: true }).lean();
    if (!theme) throw new NotFoundException('Active theme not found');
    return { success: true, data: toApi(theme) };
  }

  async listVisible(): Promise<ResponsePayload> {
    const list = await this.themes.find({ visible: true }).sort({ name: 1 }).lean();
    return { success: true, data: list.map(toApi), count: list.length };
  }

  async getById(themeId: string): Promise<ResponsePayload> {
    const theme = await this.themes.findOne({ themeId }).lean();
    if (!theme) throw new NotFoundException('Theme not found');
    return { success: true, data: toApi(theme) };
  }

  async create(dto: CreateThemeDto): Promise<ResponsePayload> {
    try {
      const doc = await this.themes.create({ ...dto, isBuiltIn: false });
      return { success: true, message: 'Theme created', data: { _id: doc._id } };
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e.code === 11000) {
        throw new ConflictException({ message: 'themeId already exists', errorCode: 'UNIQUE_FIELD' });
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateThemeDto): Promise<ResponsePayload> {
    const theme = await this.themes.findById(id);
    if (!theme) throw new NotFoundException('Theme not found');
    if (theme.isBuiltIn && dto.themeId && dto.themeId !== theme.themeId) {
      throw new ConflictException('Cannot change themeId of built-in themes');
    }
    Object.assign(theme, dto);
    await theme.save();
    return { success: true, message: 'Theme updated', data: toApi(theme.toObject() as unknown as Record<string, unknown>) };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const theme = await this.themes.findById(id);
    if (!theme) throw new NotFoundException('Theme not found');
    if (theme.isBuiltIn) {
      throw new ConflictException('Cannot delete built-in themes');
    }
    await theme.deleteOne();
    return { success: true, message: 'Theme deleted' };
  }

  async activate(themeId: string): Promise<ResponsePayload> {
    const theme = await this.themes.findOne({ themeId });
    if (!theme) throw new NotFoundException('Theme not found');
    await this.settings.updateOne({}, { $set: { activeThemeId: themeId } }, { upsert: true });
    return { success: true, message: `Activated theme '${themeId}'` };
  }
}
