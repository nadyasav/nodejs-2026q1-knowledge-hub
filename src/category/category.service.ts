import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './category.entity';
import { isUUID } from 'class-validator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { randomUUID } from 'crypto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  private categories: Map<string, Category> = new Map();

  getAll(): Category[] {
    return Array.from(this.categories.values());
  }

  getById(id: string): Category {
    if (!isUUID(id)) {
      throw new BadRequestException(`Category id ${id} is not a valid uuid`);
    }

    const category = this.categories.get(id);
    if (!category) {
      throw new NotFoundException(`Category id ${id} not found`);
    }

    return category;
  }

  create(dto: CreateCategoryDto): Category {
    const category: Category = {
      ...dto,
      id: randomUUID(),
    };

    this.categories.set(category.id, category);
    return category;
  }

  update(id: string, dto: UpdateCategoryDto) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Category id ${id} is not a valid uuid`);
    }

    const category = this.categories.get(id);
    if (!category) {
      throw new NotFoundException(`Category id ${id} not found`);
    }

    category.name = dto.name ?? category.name;
    category.description = dto.description ?? category.description;

    return category;
  }

  remove(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`Category id ${id} is not a valid uuid`);
    }

    const category = this.categories.get(id);
    if (!category) {
      throw new NotFoundException(`Category id ${id} not found`);
    }

    this.categories.delete(id);
  }
}
