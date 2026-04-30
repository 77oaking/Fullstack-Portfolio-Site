import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ContactMessage } from '../../schema/contact-message.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { ContactMessageDto } from '../../dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(@InjectModel('ContactMessage') private readonly model: Model<ContactMessage>) {}

  async submit(dto: ContactMessageDto, ip: string, userAgent: string): Promise<ResponsePayload> {
    // Honeypot: silent success on bot detection.
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

    // TODO: optional Nodemailer forward when SMTP env vars are present.
    return { success: true, message: "Thanks — I'll be in touch." };
  }
}
