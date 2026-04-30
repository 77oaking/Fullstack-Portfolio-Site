import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Apply to any controller / route that requires an admin token.
 *
 *   @UseGuards(AdminJwtAuthGuard)
 *   @Post(...)
 */
@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('adminToken') {}
