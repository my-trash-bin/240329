export interface Model {
  primitive: {};
  relation: {};
}

export type IncludeOrSelectInput<T extends Model> =
  | IncludeInput<T>
  | SelectInput<T>;
export type IncludeInput<T extends Model> = {
  include: {
    [K in keyof T["relation"]]?: T["relation"][K] extends Model
      ? IncludeOrSelectInput<T["relation"][K]> | true
      : T["relation"][K] extends Model[]
      ? IncludeOrSelectInput<T["relation"][K][number]> | true
      : never;
  };
};
export type SelectInput<T extends Model> = {
  select: {
    [K in
      | keyof T["primitive"]
      | keyof T["relation"]]?: K extends keyof T["primitive"]
      ? true
      : K extends keyof T["relation"]
      ? T["relation"][K] extends Model
        ? IncludeOrSelectInput<T["relation"][K]>
        : T["relation"][K] extends Model[]
        ? IncludeOrSelectInput<T["relation"][K][number]>
        : never
      : never;
  };
};
