import { CommentEntity } from '../comment.entity';

export type CommentType = Omit<
  Omit<CommentEntity, 'updateTimestamp'>,
  'article'
>;
