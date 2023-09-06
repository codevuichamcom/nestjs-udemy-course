import { ArticleService } from '@app/article/article.service';
import { ArticleController } from './article.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from '@app/profile/folow.entity';
import { CommentEntity } from '@app/article/comment.entity';
import { CommentService } from '@app/article/comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      FollowEntity,
      CommentEntity,
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, CommentService],
})
export class ArticleModule {}
