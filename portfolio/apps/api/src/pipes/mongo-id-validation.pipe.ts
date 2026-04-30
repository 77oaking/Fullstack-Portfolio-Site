import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * Rejects path params that aren't 24-char Mongo ObjectIds before they hit the
 * controller. Use on every `:id` route param.
 *
 *   @Get(':id') findOne(@Param('id', MongoIdValidationPipe) id: string) { ... }
 */
@Injectable()
export class MongoIdValidationPipe implements PipeTransform<string, string> {
  transform(value: string, _metadata: ArgumentMetadata): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid id: ${value}`);
    }
    return value;
  }
}
