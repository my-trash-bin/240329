import { Comment } from "./Comment";
import { ModelByFields } from "./common/ModelByFields";

import { User } from "./User";

export interface ArticlePrimitiveFields {
  id: number;
  authorId: number;
}

export interface ArticleRelationFields {
  author: User;
  comments: Comment[];
}

export type Article = ModelByFields<
  ArticlePrimitiveFields,
  ArticleRelationFields
>;
