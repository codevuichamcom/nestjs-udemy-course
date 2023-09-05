import { CreateCommentDto } from './dto/create-comment.dto';
import { ArticleEntity } from '@app/article/article.entity';
import { ArticleService } from '@app/article/article.service';
import { CommentService } from '@app/article/comment.service';
import { CreateArticleDto } from '@app/article/dto/create-article.dto';
import { UpdateArticleDto } from '@app/article/dto/update-article.dto';
import { ArticlesResponseInterface } from '@app/article/types/articles-response.interface';
import { User } from '@app/user/decorator/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticleResponseInterface } from '@app/article/types/article-response.interface';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ) {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    const isFavoritedArticle: boolean =
      await this.articleService.isFavoritedArticle(currentUser.id, article.id);
    return this.buildArticleResponse(article, isFavoritedArticle);
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getSingleArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ) {
    const article = await this.articleService.findBySlug(slug);
    const isFavoritedArticle: boolean =
      await this.articleService.isFavoritedArticle(currentUserId, article.id);
    return this.buildArticleResponse(article, isFavoritedArticle);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async delete(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return await this.articleService.deleteArticleBySlug(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article: ArticleEntity = await this.articleService.updateArticle(
      currentUserId,
      slug,
      updateArticleDto,
    );
    const isFavoritedArticle: boolean =
      await this.articleService.isFavoritedArticle(currentUserId, article.id);
    return this.buildArticleResponse(article, isFavoritedArticle);
  }

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  async addCommentToArticle(
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
    @User() currentUser,
  ) {
    return await this.commentService.createComment(
      createCommentDto,
      slug,
      currentUser,
    );
  }

  @Get(':slug/comments')
  @UseGuards(AuthGuard)
  async getCommentsOfArticle(@Param('slug') slug: string) {
    return await this.commentService.getCommentOfArticle(slug);
  }

  @Delete(':slug/comments/:commentId')
  @UseGuards(AuthGuard)
  async deleteCommentFromArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ) {
    return await this.commentService.deleteCommentOfArticle(
      slug,
      commentId,
      currentUserId,
    );
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorite(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    const article = await this.articleService.addArticleToFavorite(
      currentUserId,
      slug,
    );

    return this.buildArticleResponse(article, true);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorite(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    const article = await this.articleService.deleteArticleFromFavorite(
      currentUserId,
      slug,
    );

    return this.buildArticleResponse(article, false);
  }

  buildArticleResponse(
    article: ArticleEntity,
    favorited: boolean,
  ): ArticleResponseInterface {
    delete article.id;
    delete article.updateTimestamp;
    return {
      article: {
        ...article,
        favorited,
      },
    };
  }
}
