import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Comment } from './comment.entity';
import { ArticleService } from '../article/article.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CommentService {
  private comments: Map<string, Comment> = new Map();

  constructor(private readonly articleService: ArticleService) {}

  getByArticleId(articleId: string): Comment[] {
    return Array.from(this.comments.values()).filter(
      (c) => c.articleId === articleId,
    );
  }

  getById(id: string): Comment {
    if (!isUUID(id)) {
      throw new BadRequestException(`Comment id ${id} is not a valid uuid`);
    }
    const comment = this.comments.get(id);
    if (!comment) {
      throw new NotFoundException(`Comment id ${id} not found`);
    }
    return comment;
  }

  create(dto: CreateCommentDto): Comment {
    try {
      this.articleService.getById(dto.articleId);
    } catch {
      throw new UnprocessableEntityException(
        `Article id ${dto.articleId} not found`,
      );
    }

    const comment: Comment = {
      id: randomUUID(),
      content: dto.content,
      articleId: dto.articleId,
      authorId: dto.authorId ?? null,
      createdAt: Date.now(),
    };

    this.comments.set(comment.id, comment);
    return comment;
  }

  remove(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Comment id ${id} is not a valid uuid`);
    }

    const comment = this.comments.get(id);
    if (!comment) {
      throw new NotFoundException(`Comment id ${id} not found`);
    }

    this.comments.delete(id);
  }
}
