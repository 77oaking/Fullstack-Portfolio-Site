import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AdminPrincipal {
  _id: string;
  username: string;
  name: string;
}

/**
 * Pulls the authenticated admin off the request, populated by Passport's
 * `validate()` in `JwtAdminStrategy`.
 *
 *   @Get('me') me(@GetAdmin() admin: AdminPrincipal) { ... }
 */
export const GetAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminPrincipal => {
    const req = ctx.switchToHttp().getRequest();
    return req.admin;
  },
);
