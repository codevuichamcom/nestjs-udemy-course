import { UserType } from '@app/user/types/user.types';
import { CommentType } from './comment.type';

export interface CommentResponseInterface {
  comment: CommentType & { author: UserType };
}
