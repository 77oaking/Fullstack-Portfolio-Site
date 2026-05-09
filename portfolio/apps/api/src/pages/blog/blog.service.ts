import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrudService } from '../../common/crud.service';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { BlogPostDoc } from '../../schema/blog-post.schema';

@Injectable()
export class BlogService extends CrudService<BlogPostDoc> {
  constructor(@InjectModel('BlogPost') model: Model<BlogPostDoc>) {
    super(model, 'BlogPost');
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
    if (!doc) throw new NotFoundException('Blog post not found');
    return { success: true, data: doc };
  }
}
