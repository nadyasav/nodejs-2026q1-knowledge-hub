import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID, UUID } from 'crypto';
import { validate as isUUID } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ArticleService } from '../article/article.service';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  constructor(private readonly articleService: ArticleService) {}

  getAll(): Omit<User, 'password'>[] {
    return Array.from(this.users.values()).map(
      ({ password, ...userResult }) => userResult,
    );
  }

  getById(id: string): Omit<User, 'password'> {
    if (!isUUID(id)) {
      throw new BadRequestException(`User id ${id} is not a valid uuid`);
    }

    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }

    const { password, ...userResult } = user;
    return userResult;
  }

  create(userDto: CreateUserDto): Omit<User, 'password'> {
    const newUser: User = {
      ...userDto,
      id: randomUUID(),
      role: userDto.role ?? UserRole.VIEWER,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.set(newUser.id, newUser);
    const { password, ...userResult } = newUser;
    return userResult;
  }

  updatePassword(id: string, dto: UpdatePasswordDto) {
    if (!isUUID(id)) {
      throw new BadRequestException(`User id ${id} is not a valid uuid`);
    }

    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Incorrect old password');
    }

    user.password = dto.newPassword;
    user.updatedAt = Date.now();

    const { password, ...userResult } = user;
    return userResult;
  }

  remove(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException(`User id ${id} is not a valid uuid`);
    }

    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }

    this.users.delete(id);
    this.articleService.resetAuthorId(id as UUID);
  }
}
