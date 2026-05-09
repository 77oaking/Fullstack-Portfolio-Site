import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { ProjectDoc } from '../../schema/project.schema';

@Injectable()
export class ProjectsService extends CrudService<ProjectDoc> {
  constructor(@InjectModel('Project') model: Model<ProjectDoc>) {
    super(model, 'Project');
  }

  override async create(data: Record<string, unknown>): Promise<ResponsePayload> {
    try {
      return await super.create(data);
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e.code === 11000) {
        throw new ConflictException({ message: 'Slug already in use', errorCode: 'UNIQUE_FIELD' });
      }
      throw err;
    }
  }

  async findBySlug(slug: string): Promise<ResponsePayload> {
    const doc = await this.model.findOne({ slug }).lean();
    if (!doc) throw new NotFoundException('Project not found');
    return { success: true, data: doc };
  }

  async findFeatured(): Promise<ResponsePayload> {
    const docs = await this.model
      .find({ featured: true, status: { $ne: 'archived' } })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return { success: true, data: docs, count: docs.length };
  }
}
