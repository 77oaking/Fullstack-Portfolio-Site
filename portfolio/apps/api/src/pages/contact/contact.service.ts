import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { ContactMessageDoc } from '../../schema/contact-message.schema';
import { ContactMessageDto, UpdateContactMessageDto } from '../../dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel('ContactMessage') private readonly model: Model<ContactMessageDoc>,
  ) {}

  async submit(dto: ContactMessageDto, ip: string, userAgent: string): Promise<ResponsePayload> {
    if (dto.honeypot && dto.honeypot.length > 0) {
      this.logger.warn(`Honeypot triggered from ${ip}`);
      return { success: true, message: "Thanks — I'll be in touch." };
    }
    await this.model.create({
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
      ip,
      userAgent,
    });
    return { success: true, message: "Thanks — I'll be in touch." };
  }

  async list(): Promise<ResponsePayload> {
    const docs = await this.model.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: docs, count: docs.length };
  }

  async findOne(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException('Message not found');
    return { success: true, data: doc };
  }

  async update(id: string, dto: UpdateContactMessageDto): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException('Message not found');
    return { success: true, message: 'Message updated', data: doc };
  }

  async remove(id: string): Promise<ResponsePayload> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Message not found');
    return { success: true, message: 'Message deleted' };
  }
}
