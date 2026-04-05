import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [ArticleModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
