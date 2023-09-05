import { UserType } from '@app/user/types/user.types';

export interface CommentsResponseInterfaceItem {
  id: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: UserType;
}

export interface CommentsResponseInterface {
  comments: CommentsResponseInterfaceItem[];
}
