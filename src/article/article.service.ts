import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article, ArticleStatus } from './article.entity';
import { validate as isUUID } from 'uuid';
import { CreateArticleDto } from './dto/create-article.dto';
import { randomUUID, UUID } from 'crypto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  private articles: Map<string, Article> = new Map();

  getAll(status?: string, categoryId?: string, tag?: string): Article[] {
    let articlesRes = Array.from(this.articles.values());

    articlesRes = articlesRes.filter((article) => {
      if (status && article.status !== status) {
        return false;
      }

      if (categoryId && article.categoryId !== categoryId) {
        return false;
      }

      if (tag && !article.tags.includes(tag)) {
        return false;
      }

      return true;
    });

    return articlesRes;
  }

  getById(id: string): Article {
    if (!isUUID(id)) {
      throw new BadRequestException(`Article id ${id} is not a valid uuid`);
    }

    const article = this.articles.get(id);
    if (!article) {
      throw new NotFoundException(`Article id ${id} not found`);
    }

    return article;
  }

  create(dto: CreateArticleDto): Article {
    const article: Article = {
      ...dto,
      id: randomUUID(),
      status: dto.status ?? ArticleStatus.DRAFT,
      authorId: dto.authorId ?? null,
      categoryId: dto.categoryId ?? null,
      tags: dto.tags ?? [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.articles.set(article.id, article);
    return article;
  }

  update(id: string, dto: UpdateArticleDto) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Article id ${id} is not a valid uuid`);
    }

    const article = this.articles.get(id);
    if (!article) {
      throw new NotFoundException(`Article id ${id} not found`);
    }

    if (dto.title !== undefined) article.title = dto.title;
    if (dto.content !== undefined) article.content = dto.content;
    if (dto.status !== undefined) article.status = dto.status;
    if (dto.authorId !== undefined) article.authorId = dto.authorId;
    if (dto.categoryId !== undefined) article.categoryId = dto.categoryId;
    if (dto.tags !== undefined) article.tags = dto.tags;

    article.updatedAt = Date.now();

    return article;
  }

  remove(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Article id ${id} is not a valid uuid`);
    }

    const article = this.articles.get(id);
    if (!article) {
      throw new NotFoundException(`Article id ${id} not found`);
    }

    this.articles.delete(id);
  }

  resetAuthorId(authorId: UUID) {
    this.articles.forEach((article) => {
      if (article.authorId === authorId) {
        article.authorId = null;
      }
    });
  }

  resetCategoryId(categoryId: UUID) {
    this.articles.forEach((article) => {
      if (article.categoryId === categoryId) {
        article.categoryId = null;
      }
    });
  }
}
