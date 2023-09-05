import { ArticleEntity } from '@app/article/article.entity';
import { ArticleType } from './article.type';
export interface ArticleResponseInterface {
  article: ArticleType & { favorited: boolean };
}
