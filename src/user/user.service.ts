import { Injectable } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  getAll(): Omit<User, 'password'>[] {
    return Array.from(this.users.values()).map(
      ({ password, ...userResult }) => userResult,
    );
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
}
