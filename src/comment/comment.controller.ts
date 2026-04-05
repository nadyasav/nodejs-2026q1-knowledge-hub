import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getByArticleId(@Query('articleId') articleId: string) {
    return this.commentService.getByArticleId(articleId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.commentService.getById(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
