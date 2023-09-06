import { CommentType } from '@app/article/types/comment.type';
import { UserType } from '@app/user/types/user.types';

export interface CommentResponseInterface {
  comment: CommentType & { author: UserType };
}
