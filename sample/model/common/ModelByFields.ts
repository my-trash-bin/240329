interface ModelByFieldsInternal<
  TPrimitiveFields extends {},
  TRelationFields extends {}
> {
  primitive: TPrimitiveFields;
  relation: TRelationFields;
}

export type ModelByFields<
  TPrimitiveFields extends {},
  TRelationFields extends {}
> = [keyof TPrimitiveFields & keyof TRelationFields] extends [never]
  ? ModelByFieldsInternal<TPrimitiveFields, TRelationFields>
  : {
      message: "Error: key overlap";
      keys: keyof TRelationFields & keyof TPrimitiveFields;
    };
