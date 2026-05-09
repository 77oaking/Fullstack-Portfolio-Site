import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model, FilterQuery, UpdateQuery, Document } from 'mongoose';
import type { ResponsePayload } from '../dto/common/response-payload.interface';

/**
 * Generic CRUD building block — collection-backed entities (Experience,
 * Education, Project, etc.) extend this and implement only domain logic.
 *
 * Sort default: { order: 1, createdAt: -1 } so admin-set ordering wins, falling
 * back to newest-first.
 */
@Injectable()
export abstract class CrudService<T extends Document> {
  protected readonly logger: Logger;

  protected constructor(
    protected readonly model: Model<T>,
    protected readonly entityName: string,
  ) {
    this.logger = new Logger(`${entityName}Service`);
  }

  async create(data: Record<string, unknown>): Promise<ResponsePayload> {
    const created = await this.model.create(data as never);
    return {
      success: true,
      message: `${this.entityName} created`,
      data: (created as unknown as { toJSON: () => unknown }).toJSON(),
    };
  }

  async findAll(
    filter: FilterQuery<T> = {},
    sort: Record<string, 1 | -1> = { order: 1, createdAt: -1 },
  ): Promise<ResponsePayload> {
    const docs = await this.model.find(filter).sort(sort).lean();
    return { success: true, data: docs, count: docs.length };
  }

  async findOne(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException(`${this.entityName} not found`);
    return { success: true, data: doc };
  }

  async update(id: string, data: UpdateQuery<T> | Record<string, unknown>): Promise<ResponsePayload> {
    const doc = await this.model
      .findByIdAndUpdate(id, data as UpdateQuery<T>, { new: true, runValidators: true })
      .lean();
    if (!doc) throw new NotFoundException(`${this.entityName} not found`);
    return { success: true, message: `${this.entityName} updated`, data: doc };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const result = await this.model.findByIdAndDelete(id).lean();
    if (!result) throw new NotFoundException(`${this.entityName} not found`);
    return { success: true, message: `${this.entityName} deleted` };
  }

  async removeAll(): Promise<ResponsePayload> {
    const result = await this.model.deleteMany({});
    return {
      success: true,
      message: `${this.entityName} cleared`,
      count: result.deletedCount,
    };
  }
}
