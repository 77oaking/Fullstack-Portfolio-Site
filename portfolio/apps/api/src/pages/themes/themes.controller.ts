import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateThemeDto, UpdateThemeDto } from '../../dto/theme.dto';
import { ThemesService } from './themes.service';

@ApiTags('themes')
@Controller('themes')
export class ThemesController {
  constructor(private readonly service: ThemesService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get the currently-active theme' })
  active() {
    return this.service.getActive();
  }

  @Get()
  @ApiOperation({ summary: 'List all visible themes' })
  list() {
    return this.service.listVisible();
  }

  @Get('by-id/:themeId')
  @ApiOperation({ summary: 'Get a theme by its kebab-case themeId' })
  byId(@Param('themeId') themeId: string) {
    return this.service.getById(themeId);
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  create(@Body() dto: CreateThemeDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateThemeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }

  @Post('activate/:themeId')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  activate(@Param('themeId') themeId: string) {
    return this.service.activate(themeId);
  }
}
