import { ModelByFields } from "./common/ModelByFields";

import { Article } from "./Article";

export interface UserPrimitiveFields {
  id: number;
  name: string;
  email?: string[];
}

export interface UserRelationFields {
  articles: Article[];
  comments: Comment[];
}

export type User = ModelByFields<UserPrimitiveFields, UserRelationFields>;
