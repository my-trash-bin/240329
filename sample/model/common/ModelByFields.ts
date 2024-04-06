type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;
type Expand2<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

interface ModelByFieldsInternal<
  TName extends string,
  TPrimitiveFields extends {},
  TRelationFields extends {}
> {
  name: TName;
  primitive: TPrimitiveFields;
  relation: TRelationFields;
}

export type ModelByFields<
  TName extends string,
  TPrimitiveFields extends {},
  TRelationFields extends {}
> = [keyof TPrimitiveFields & keyof TRelationFields] extends [never]
  ? Expand2<ModelByFieldsInternal<TName, TPrimitiveFields, TRelationFields>>
  : {
      message: "Error: key overlap";
      keys: keyof TRelationFields & keyof TPrimitiveFields;
    };
