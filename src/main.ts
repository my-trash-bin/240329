export interface Model {
  primitive: {};
  relation: {};
}

export type Input<T extends Model> = true | IncludeInput<T> | SelectInput<T>;

export type IncludeInput<T extends Model> = {
  include: {
    [K in keyof T["relation"]]?: NonNullable<T["relation"][K]> extends Model
      ? Input<NonNullable<T["relation"][K]>>
      : NonNullable<T["relation"][K]> extends Model[]
      ? Input<NonNullable<T["relation"][K]>[number]>
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
      ? NonNullable<T["relation"][K]> extends Model
        ? Input<NonNullable<T["relation"][K]>>
        : NonNullable<T["relation"][K]> extends Model[]
        ? Input<NonNullable<T["relation"][K]>[number]>
        : never
      : never;
  };
};

export type Result<
  TModel extends Model,
  TInput extends Input<TModel>
> = TInput extends true
  ? TModel["primitive"]
  : TInput extends IncludeInput<TModel>
  ? IncludeResult<TModel, TInput>
  : TInput extends SelectInput<TModel>
  ? SelectResult<TModel, TInput>
  : never;

export type IncludeResult<
  TModel extends Model,
  TInput extends IncludeInput<TModel>
> = TModel["primitive"] & {
  [K in keyof TInput["include"]]-?: K extends keyof TModel["relation"]
    ? NonNullable<TModel["relation"][K]> extends Model
      ? TInput["include"][K] extends Input<NonNullable<TModel["relation"][K]>>
        ?
            | Result<NonNullable<TModel["relation"][K]>, TInput["include"][K]>
            | ({} extends Pick<TModel["relation"], K> ? null : never)
        : {
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["include"][K];
          }
      : NonNullable<TModel["relation"][K]> extends Model[]
      ? TInput["include"][K] extends Input<
          NonNullable<TModel["relation"][K]>[number]
        >
        ?
            | Result<
                NonNullable<TModel["relation"][K]>[number],
                TInput["include"][K]
              >[]
            | ({} extends Pick<TModel["relation"], K> ? null : never)
        : {
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["include"][K];
          }
      : {
          message: "Invalid model";
          parent: TModel;
          key: K;
          children: NonNullable<TModel["relation"][K]>;
        }
    : never;
};

export type SelectResult<
  TModel extends Model,
  TInput extends SelectInput<TModel>
> = {
  [K in keyof TInput["select"]]-?: K extends keyof TModel["relation"]
    ? NonNullable<TModel["relation"][K]> extends Model
      ? TInput["select"][K] extends Input<NonNullable<TModel["relation"][K]>>
        ?
            | Result<NonNullable<TModel["relation"][K]>, TInput["select"][K]>
            | ({} extends Pick<TModel["relation"], K> ? null : never)
        : {
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["select"][K];
          }
      : NonNullable<TModel["relation"][K]> extends Model[]
      ? TInput["select"][K] extends Input<
          NonNullable<TModel["relation"][K]>[number]
        >
        ?
            | Result<
                NonNullable<TModel["relation"][K]>[number],
                TInput["select"][K]
              >[]
            | ({} extends Pick<TModel["relation"], K> ? null : never)
        : {
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["select"][K];
          }
      : {
          message: "Invalid model";
          parent: TModel;
          key: K;
          children: NonNullable<TModel["relation"][K]>;
        }
    : K extends keyof TModel["primitive"]
    ?
        | TModel["primitive"][K]
        | ({} extends Pick<TModel["primitive"], K> ? null : never)
    : never;
};
