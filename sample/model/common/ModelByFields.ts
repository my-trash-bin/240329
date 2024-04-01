import { Model } from "../../../src/main";

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
  ? // ? TRelationFields extends Partial<Record<string, Model | Model[]>>
    ModelByFieldsInternal<TPrimitiveFields, TRelationFields>
  : // : {
    //     message: "Error: unrecognized field";
    //     keys: {
    //       [K in keyof TRelationFields]-?: TRelationFields[K] extends
    //         | Model
    //         | Model[]
    //         ? never
    //         : K;
    //     }[keyof TRelationFields];
    //   }
    {
      message: "Error: key overlap";
      keys: keyof TRelationFields & keyof TPrimitiveFields;
    };
