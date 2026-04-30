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
import {
  CreateProjectDto,
  FilterAndPaginationProjectDto,
  ReorderDto,
  UpdateProjectDto,
} from '../../dto/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  // ---- public --------------------------------------------------------

  @Post('get-all')
  @ApiOperation({ summary: 'List published projects (public)' })
  getAll(@Body() dto: FilterAndPaginationProjectDto) {
    return this.service.findAllPublic(dto);
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Get a published project by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get('featured')
  @ApiOperation({ summary: 'List published + featured projects (sorted)' })
  getFeatured() {
    return this.service.findFeatured();
  }

  // ---- admin ---------------------------------------------------------

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Create a project' })
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @Post('admin/get-all')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'List all projects (any status) — admin' })
  getAllAdmin(@Body() dto: FilterAndPaginationProjectDto) {
    return this.service.findAllAdmin(dto);
  }

  @Get('admin/:id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Get a project (any status) by id — admin' })
  getById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }

  @Post('reorder')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  @ApiOperation({ summary: 'Reorder projects by an ordered id list' })
  reorder(@Body() dto: ReorderDto) {
    return this.service.reorder(dto);
  }
}
