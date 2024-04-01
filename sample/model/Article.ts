import { ModelByFields } from "./common/ModelByFields";

import { User } from "./User";

export interface ArticlePrimitiveFields {
  id: number;
  authorId: number;
}

export interface ArticleRelationFields {
  author: User;
}

export type Article = ModelByFields<
  ArticlePrimitiveFields,
  ArticleRelationFields
>;
