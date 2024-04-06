import { ModelByFields } from "./common/ModelByFields";

import { Article } from "./Article";
import { Comment } from "./Comment";

export interface UserPrimitiveFields {
  id: number;
  name: string;
  email?: string[];
}

export interface UserRelationFields {
  articles: Article[];
  comments: Comment[];
}

export type User = ModelByFields<
  "User",
  UserPrimitiveFields,
  UserRelationFields
>;
