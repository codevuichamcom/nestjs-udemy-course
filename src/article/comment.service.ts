import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, getRepository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseInterface } from './types/comment-response.interface';
import { CommentsResponseInterface } from './types/comments-response.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    slug: string,
    currentUser: UserEntity,
  ): Promise<CommentResponseInterface> {
    const article: ArticleEntity = await this.articleRepository.findOne({
      slug,
    });

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    let comment: CommentEntity = new CommentEntity();
    Object.assign(comment, createCommentDto);
    comment.article = article;
    comment.author = currentUser;
    comment = await this.commentRepository.save(comment);

    delete comment.article;
    return {
      comment: {
        ...comment,
      },
    };
  }

  async getCommentOfArticle(slug: string): Promise<CommentsResponseInterface> {
    const queryBuilder = getRepository(CommentEntity)
      .createQueryBuilder('comments')
      .leftJoin('comments.article', 'article')
      .leftJoinAndSelect('comments.author', 'author')
      .where('article.slug = :slug', {
        slug,
      });

    const comments = await queryBuilder.getMany();
    return {
      comments,
    };
  }

  async deleteCommentOfArticle(
    slug: string,
    commentId: number,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const queryBuilder = getRepository(CommentEntity)
      .createQueryBuilder('comments')
      .leftJoin('comments.article', 'article')
      .where('article.slug = :slug', {
        slug,
      })
      .andWhere('comments.authorId = :authorId', { authorId: currentUserId })
      .andWhere('comments.id = :id', { id: commentId });

    const comment = await queryBuilder.getOne();
    if (!comment) {
      throw new HttpException('Comment does not exist', HttpStatus.NOT_FOUND);
    }

    return await this.commentRepository.delete({ id: comment.id });
  }
}
