import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { CreateBlogPostDto, UpdateBlogPostDto } from '../../dto/blog-post.dto';
import { BlogService } from './blog.service';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get()
  list() {
    return this.service.findAll({ published: true }, { publishedAt: -1, createdAt: -1 });
  }

  @Get('all')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  listAll() {
    return this.service.findAll({}, { publishedAt: -1, createdAt: -1 });
  }

  @Get('by-slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  create(@Body() dto: CreateBlogPostDto) {
    return this.service.create(dto as unknown as Record<string, unknown>);
  }

  @Put(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() dto: UpdateBlogPostDto) {
    return this.service.update(id, dto as unknown as Record<string, unknown>);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiSecurity('admin')
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.service.remove(id);
  }
}
