import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the full portfolio bundle (everything the public UI needs in one round-trip)',
  })
  bundle() {
    return this.service.getBundle();
  }
}
