import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Admin } from '../schema/admin.schema';

interface AdminJwtPayload {
  sub: string;
  username: string;
  name: string;
}

/**
 * JWT strategy for admin requests.
 *
 * Tokens come in via the custom header `administrator` (matching rone-api),
 * NOT the standard `Authorization: Bearer ...`.
 *
 * Passport assigns the result of `validate()` to `request.admin` because of
 * `property: 'admin'` set in PassportModule.register.
 */
@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'adminToken') {
  constructor(
    config: ConfigService,
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req.headers['administrator'] as string) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.adminSecret'),
    });
  }

  async validate(payload: AdminJwtPayload) {
    const admin = await this.adminModel.findById(payload.sub).lean();
    if (!admin || !admin.hasAccess) {
      throw new UnauthorizedException('Admin not found or access revoked');
    }
    return { _id: String(admin._id), username: admin.username, name: admin.name };
  }
}
