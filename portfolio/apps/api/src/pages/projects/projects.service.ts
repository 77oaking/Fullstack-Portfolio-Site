import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { Project } from '../../schema/project.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import {
  CreateProjectDto,
  FilterAndPaginationProjectDto,
  ReorderDto,
  UpdateProjectDto,
} from '../../dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel('Project') private readonly model: Model<Project>) {}

  async create(dto: CreateProjectDto): Promise<ResponsePayload> {
    try {
      const doc = await this.model.create({
        ...dto,
        publishedAt: dto.status === 'published' ? new Date() : null,
      });
      return { success: true, message: 'Project created', data: { _id: doc._id } };
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 11000) {
        throw new ConflictException({ message: 'Slug already in use', errorCode: 'UNIQUE_FIELD' });
      }
      throw err;
    }
  }

  async findAllPublic(dto: FilterAndPaginationProjectDto): Promise<ResponsePayload> {
    return this.findAllInternal({ ...dto, filter: { ...(dto.filter ?? {}), status: 'published' } });
  }

  async findAllAdmin(dto: FilterAndPaginationProjectDto): Promise<ResponsePayload> {
    return this.findAllInternal(dto);
  }

  async findBySlug(slug: string): Promise<ResponsePayload> {
    const project = await this.model.findOne({ slug, status: 'published' }).lean();
    if (!project) throw new NotFoundException('Project not found');
    return { success: true, data: project };
  }

  async findFeatured(): Promise<ResponsePayload> {
    const projects = await this.model
      .find({ status: 'published', featured: true })
      .sort({ order: 1 })
      .lean();
    return { success: true, data: projects, count: projects.length };
  }

  async findById(id: string): Promise<ResponsePayload> {
    const project = await this.model.findById(id).lean();
    if (!project) throw new NotFoundException('Project not found');
    return { success: true, data: project };
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ResponsePayload> {
    const update: Record<string, unknown> = { ...dto };
    if (dto.status === 'published') update.publishedAt = new Date();

    try {
      const project = await this.model.findByIdAndUpdate(id, update, { new: true }).lean();
      if (!project) throw new NotFoundException('Project not found');
      return { success: true, message: 'Project updated', data: project };
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e.code === 11000) {
        throw new ConflictException({ message: 'Slug already in use', errorCode: 'UNIQUE_FIELD' });
      }
      throw err;
    }
  }

  async remove(id: string): Promise<ResponsePayload> {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Project not found');
    return { success: true, message: 'Project deleted' };
  }

  async reorder(dto: ReorderDto): Promise<ResponsePayload> {
    const ops = dto.ids.map((id, idx) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: idx } } },
    }));
    if (ops.length) await this.model.bulkWrite(ops);
    return { success: true, message: 'Reordered' };
  }

  // ---- internal --------------------------------------------------------

  private async findAllInternal(dto: FilterAndPaginationProjectDto): Promise<ResponsePayload> {
    const filter: Record<string, unknown> = {};
    const f = dto.filter ?? {};

    if (f.status) filter.status = f.status;
    if (typeof f.featured === 'boolean') filter.featured = f.featured;
    if (f.tags?.length) filter.tags = { $in: f.tags };
    if (f.q) {
      filter.$or = [
        { title: { $regex: f.q, $options: 'i' } },
        { summary: { $regex: f.q, $options: 'i' } },
      ];
    }

    const pageNumber = dto.pagination?.pageNumber ?? 1;
    const pageSize = dto.pagination?.pageSize ?? 20;
    const skip = (pageNumber - 1) * pageSize;
    const sort = dto.sort ?? { order: 1, createdAt: -1 };

    const [data, count] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(pageSize).lean(),
      this.model.countDocuments(filter),
    ]);

    return { success: true, data, count };
  }
}
