import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import type { Admin } from '../../schema/admin.schema';
import type { ResponsePayload } from '../../dto/common/response-payload.interface';
import { AdminLoginDto, ChangePasswordDto } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: AdminLoginDto): Promise<ResponsePayload> {
    const admin = await this.adminModel
      .findOne({ username: dto.username.toLowerCase() })
      .select('+password');

    if (!admin || !admin.hasAccess) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, admin.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwt.signAsync({
      sub: String(admin._id),
      username: admin.username,
      name: admin.name,
    });

    admin.lastLoggedIn = new Date();
    await admin.save();

    return {
      success: true,
      message: 'Login successful',
      data: {
        _id: String(admin._id),
        username: admin.username,
        name: admin.name,
        lastLoggedIn: admin.lastLoggedIn,
      },
      // The shared-types AdminLoginResponse adds `token, tokenExpiredIn` outside
      // the data envelope to match rone-api's pattern.
      // Cast through unknown so TS allows the extension.
      ...({
        token,
        tokenExpiredIn: this.config.get<number>('jwt.adminExpiresIn'),
      } as unknown as Record<string, unknown>),
    };
  }

  async me(adminId: string): Promise<ResponsePayload> {
    const admin = await this.adminModel.findById(adminId).lean();
    if (!admin) throw new NotFoundException('Admin not found');
    return {
      success: true,
      data: {
        _id: String(admin._id),
        username: admin.username,
        name: admin.name,
        lastLoggedIn: admin.lastLoggedIn,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }

  async changePassword(adminId: string, dto: ChangePasswordDto): Promise<ResponsePayload> {
    const admin = await this.adminModel.findById(adminId).select('+password');
    if (!admin) throw new NotFoundException('Admin not found');

    const ok = await bcrypt.compare(dto.currentPassword, admin.password);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');

    if (dto.currentPassword === dto.newPassword) {
      throw new ConflictException('New password must differ from current');
    }

    admin.password = await bcrypt.hash(dto.newPassword, 10);
    await admin.save();

    return { success: true, message: 'Password changed' };
  }
}
