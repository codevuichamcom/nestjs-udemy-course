import { CommentEntity } from '@app/article/comment.entity';

export type CommentType = Omit<
  Omit<CommentEntity, 'updateTimestamp'>,
  'article'
>;
