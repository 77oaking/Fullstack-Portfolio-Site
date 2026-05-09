import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { AdminOpsService } from './admin-ops.service';

class ResetConfirmationDto {
  /**
   * The literal string "RESET" — required as a small UX guardrail so a
   * stray POST can't wipe the whole portfolio.
   */
  @IsString()
  confirm!: string;
}

@ApiTags('admin-ops')
@Controller('admin')
export class AdminOpsController {
  constructor(private readonly service: AdminOpsService) {}

  @Post('reset')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({
    summary: 'Wipe ALL portfolio data (preserves admin user). Send { confirm: "RESET" }',
  })
  reset(@Body() dto: ResetConfirmationDto) {
    if (dto.confirm !== 'RESET') {
      return {
        success: false,
        message: 'Reset aborted — body must include { "confirm": "RESET" }',
        errorCode: 'CONFIRMATION_REQUIRED',
      };
    }
    return this.service.resetAll();
  }
}
