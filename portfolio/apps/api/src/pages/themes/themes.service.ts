import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import type { Theme } from '../../schema/theme.schema';
import type { SettingsDoc } from '../../schema/settings.schema';
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
    @InjectModel('Settings') private readonly settings: Model<SettingsDoc>,
  ) {}

  private getThemesDir(): string | null {
    const candidates = [
      path.resolve(process.cwd(), 'libs', 'themes'),
      path.resolve(process.cwd(), '..', '..', 'libs', 'themes'),
    ];
    for (const dir of candidates) {
      if (fs.existsSync(dir)) return dir;
    }
    return null;
  }

  private loadBuiltInThemes(): Array<Record<string, unknown>> {
    const themesDir = this.getThemesDir();
    if (!themesDir) return [];
    const files = fs.readdirSync(themesDir).filter((f) => f.endsWith('.json'));
    return files.map((file) => {
      const json = JSON.parse(fs.readFileSync(path.join(themesDir, file), 'utf-8')) as Record<string, unknown>;
      return {
        themeId: json.id,
        name: json.name,
        description: json.description,
        preview: json.preview,
        mode: json.mode,
        tokens: json.tokens,
        components: json.components ?? null,
        isBuiltIn: true,
        visible: true,
      };
    });
  }

  private async syncBuiltInThemes(): Promise<void> {
    const builtIns = this.loadBuiltInThemes();
    if (!builtIns.length) return;
    await Promise.all(
      builtIns.map((theme) =>
        this.themes.updateOne(
          { themeId: theme.themeId },
          { $set: { ...theme, isBuiltIn: true } },
          { upsert: true },
        ),
      ),
    );
  }

  private async ensureThemeExists(themeId: string): Promise<Record<string, unknown> | null> {
    const existing = await this.themes.findOne({ themeId }).lean();
    if (existing) return existing as unknown as Record<string, unknown>;

    const builtIn = this.loadBuiltInThemes().find((t) => t.themeId === themeId);
    if (!builtIn) return null;

    await this.themes.updateOne(
      { themeId },
      { $set: builtIn },
      { upsert: true },
    );
    const created = await this.themes.findOne({ themeId }).lean();
    return (created as unknown as Record<string, unknown>) ?? (builtIn as Record<string, unknown>);
  }

  async getActive(): Promise<ResponsePayload> {
    await this.syncBuiltInThemes();
    const settings = await this.settings.findOne().lean();
    const themeId = settings?.activeTheme ?? 'minimal-light';
    const theme = await this.ensureThemeExists(themeId);
    if (!theme) throw new NotFoundException('Active theme not found');
    return { success: true, data: toApi(theme) };
  }

  async listVisible(): Promise<ResponsePayload> {
    await this.syncBuiltInThemes();
    const list = await this.themes.find({ visible: true }).sort({ name: 1 }).lean();
    const byId = new Map<string, Record<string, unknown>>();
    for (const item of list as unknown as Array<Record<string, unknown>>) {
      const id = String(item.themeId ?? '');
      if (id) byId.set(id, item);
    }

    for (const builtIn of this.loadBuiltInThemes()) {
      const id = String(builtIn.themeId ?? '');
      if (!id) continue;
      if (!byId.has(id)) {
        byId.set(id, builtIn);
      }
    }

    const merged = [...byId.values()].sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')));
    return { success: true, data: merged.map(toApi), count: merged.length };
  }

  async getById(themeId: string): Promise<ResponsePayload> {
    await this.syncBuiltInThemes();
    const theme = await this.ensureThemeExists(themeId);
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
    await this.syncBuiltInThemes();
    const theme = await this.ensureThemeExists(themeId);
    if (!theme) throw new NotFoundException('Theme not found');
    await this.settings.updateOne({}, { $set: { activeTheme: themeId } }, { upsert: true });
    return { success: true, message: `Activated theme '${themeId}'` };
  }
}
