import { ModelByFields } from "../../00-common/ModelByFields";
import { Comment } from "./Comment";

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
  "Article",
  ArticlePrimitiveFields,
  ArticleRelationFields
>;
