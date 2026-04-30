import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AdminSchema } from '../../schema/admin.schema';
import { JwtAdminStrategy } from '../../guards/admin-jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'adminToken',
      property: 'admin',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.adminSecret'),
        signOptions: { expiresIn: config.get<number>('jwt.adminExpiresIn') },
      }),
    }),
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAdminStrategy],
  exports: [PassportModule, MongooseModule, JwtModule],
})
export class AuthModule {}
