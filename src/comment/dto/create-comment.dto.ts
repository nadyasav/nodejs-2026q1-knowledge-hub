import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  articleId: string;

  @IsOptional()
  @ValidateIf((dto) => dto.authorId !== null)
  @IsUUID()
  authorId?: string | null;
}
