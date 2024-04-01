import { ModelByFields } from "./common/ModelByFields";

import { Article } from "./Article";

export interface UserPrimitiveFields {
  id: number;
}

export interface UserRelationFields {
  articles: Article[];
}

export type User = ModelByFields<UserPrimitiveFields, UserRelationFields>;
