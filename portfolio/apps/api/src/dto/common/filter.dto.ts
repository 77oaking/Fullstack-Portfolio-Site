import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

/**
 * Generic filter+pagination wrapper. Every list endpoint accepts a body of
 * this shape (POST /resource/get-all). Specific resources extend it with a
 * typed `filter` object.
 */
export class FilterAndPaginationDto<TFilter = Record<string, unknown>> {
  @IsOptional()
  @IsObject()
  filter?: TFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;

  @IsOptional()
  @IsObject()
  sort?: Record<string, 1 | -1>;

  @IsOptional()
  select?: string | Record<string, 0 | 1>;
}
