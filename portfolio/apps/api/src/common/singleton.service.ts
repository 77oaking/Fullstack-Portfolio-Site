import { Injectable, Logger } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import type { ResponsePayload } from '../dto/common/response-payload.interface';

/**
 * Generic upsert-only service for singleton documents (Profile, Hero, About,
 * Settings). The DB is expected to hold at most ONE document per singleton
 * collection — get() always returns that doc (or null), upsert() creates or
 * updates it in place.
 */
@Injectable()
export abstract class SingletonService<T extends Document> {
  protected readonly logger: Logger;

  protected constructor(
    protected readonly model: Model<T>,
    protected readonly entityName: string,
  ) {
    this.logger = new Logger(`${entityName}Service`);
  }

  async get(): Promise<ResponsePayload> {
    const doc = await this.model.findOne().lean();
    return { success: true, data: doc ?? null };
  }

  async upsert(data: Record<string, unknown>): Promise<ResponsePayload> {
    const doc = await this.model
      .findOneAndUpdate({}, data as never, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      })
      .lean();
    return { success: true, message: `${this.entityName} saved`, data: doc };
  }

  async clear(): Promise<ResponsePayload> {
    await this.model.deleteMany({});
    return { success: true, message: `${this.entityName} cleared` };
  }
}
