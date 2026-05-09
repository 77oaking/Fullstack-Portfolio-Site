import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class ParseCvInputDto {
  @IsOptional()
  @IsString()
  @MinLength(20)
  text?: string;

  @IsOptional()
  @IsString()
  @IsIn(['text', 'pdf', 'docx', 'image'])
  sourceType?: 'text' | 'pdf' | 'docx' | 'image';

  @IsOptional()
  @IsString()
  @IsIn(['basic', 'ollama'])
  parserEngine?: 'basic' | 'ollama';
}

export class ApplyCvImportDto {
  @IsString()
  @MinLength(20)
  text!: string;

  @IsOptional()
  @IsString()
  @IsIn(['replace', 'merge'])
  mode?: 'replace' | 'merge';

  @IsOptional()
  @IsString()
  @IsIn(['basic', 'ollama'])
  parserEngine?: 'basic' | 'ollama';
}
