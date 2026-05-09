import { IsString } from 'class-validator';

export class UpdateCvSummaryDto {
  @IsString() text!: string;
}
