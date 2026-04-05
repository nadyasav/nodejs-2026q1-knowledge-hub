import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ArticleStatus } from '../article.entity';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @ValidateIf((dto) => dto.authorId !== null)
  @IsUUID()
  authorId?: string | null;

  @IsOptional()
  @ValidateIf((dto) => dto.categoryId !== null)
  @IsUUID()
  categoryId?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
