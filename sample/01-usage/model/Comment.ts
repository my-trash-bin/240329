import { ModelByFields } from "../../00-common/ModelByFields";

import { Article } from "./Article";
import { User } from "./User";

export interface CommentPrimitiveFields {
  id: number;
  articleId: number;
  userId?: number;
}

export interface CommentRelationFields {
  article: Article;
  user?: User;
}

export type Comment = ModelByFields<
  "Comment",
  CommentPrimitiveFields,
  CommentRelationFields
>;
