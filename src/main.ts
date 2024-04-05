type OK<T> = { isError: false; value: T };
type ErrorBase<T> = { isError: true; details?: T };
type AnyError = ErrorBase<undefined>;
type Wrap<T> = [{ isError: true }] extends [T]
  ? T extends { isError: true }
    ? T
    : never
  : OK<T>;
type Postprocess<T> = [AnyError] extends [T[keyof T]]
  ? Extract<T[keyof T], ErrorBase<any>>
  : { [K in keyof T]: T[K] extends OK<infer I> ? I : never };
type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

export interface Model {
  primitive: {};
  relation: {};
}

export type Input<T extends Model> = true | IncludeInput<T> | SelectInput<T>;

export type IncludeInput<T extends Model> = {
  include: Postprocess<IncludeInputInternal<T>>;
};
type IncludeInputInternal<T extends Model> = {
  [K in keyof T["relation"]]?: NonNullable<T["relation"][K]> extends Model
    ? Wrap<Input<NonNullable<T["relation"][K]>>>
    : NonNullable<T["relation"][K]> extends Model[]
    ? Wrap<Input<NonNullable<T["relation"][K]>[number]>>
    : ErrorBase<{
        message: "Invalid model";
        parent: T;
        key: K;
        children: NonNullable<T["relation"][K]>;
      }>;
};

export type SelectInput<T extends Model> = {
  select: Postprocess<SelectInputInternal<T>>;
};
type SelectInputInternal<T extends Model> = {
  [K in
    | keyof T["primitive"]
    | keyof T["relation"]]?: K extends keyof T["primitive"]
    ? true
    : K extends keyof T["relation"]
    ? NonNullable<T["relation"][K]> extends Model
      ? Wrap<Input<NonNullable<T["relation"][K]>>>
      : NonNullable<T["relation"][K]> extends Model[]
      ? Wrap<Input<NonNullable<T["relation"][K]>[number]>>
      : ErrorBase<{
          message: "Invalid model";
          parent: T;
          key: K;
          children: NonNullable<T["relation"][K]>;
        }>
    : never;
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
> = ExpandRecursively<Postprocess<IncludeResultInternal<TModel, TInput>>>;
type IncludeResultInternal<
  TModel extends Model,
  TInput extends IncludeInput<TModel>
> = TModel["primitive"] & {
  [K in keyof TInput["include"]]-?: K extends keyof TModel["relation"]
    ? NonNullable<TModel["relation"][K]> extends Model
      ? TInput["include"][K] extends Input<NonNullable<TModel["relation"][K]>>
        ? Wrap<
            | Result<NonNullable<TModel["relation"][K]>, TInput["include"][K]>
            | ({} extends Pick<TModel["relation"], K> ? null : never)
          >
        : ErrorBase<{
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["include"][K];
          }>
      : NonNullable<TModel["relation"][K]> extends Model[]
      ? TInput["include"][K] extends Input<
          NonNullable<TModel["relation"][K]>[number]
        >
        ? Wrap<
            | Result<
                NonNullable<TModel["relation"][K]>[number],
                TInput["include"][K]
              >[]
            | ({} extends Pick<TModel["relation"], K> ? null : never)
          >
        : ErrorBase<{
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["include"][K];
          }>
      : ErrorBase<{
          message: "Invalid model";
          parent: TModel;
          key: K;
          children: NonNullable<TModel["relation"][K]>;
        }>
    : never;
};

export type SelectResult<
  TModel extends Model,
  TInput extends SelectInput<TModel>
> = ExpandRecursively<Postprocess<SelectResultInternal<TModel, TInput>>>;
type SelectResultInternal<
  TModel extends Model,
  TInput extends SelectInput<TModel>
> = {
  [K in keyof TInput["select"]]-?: K extends keyof TModel["relation"]
    ? NonNullable<TModel["relation"][K]> extends Model
      ? TInput["select"][K] extends Input<NonNullable<TModel["relation"][K]>>
        ? Wrap<
            | Result<NonNullable<TModel["relation"][K]>, TInput["select"][K]>
            | ({} extends Pick<TModel["relation"], K> ? null : never)
          >
        : ErrorBase<{
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["select"][K];
          }>
      : NonNullable<TModel["relation"][K]> extends Model[]
      ? TInput["select"][K] extends Input<
          NonNullable<TModel["relation"][K]>[number]
        >
        ? Wrap<
            | Result<
                NonNullable<TModel["relation"][K]>[number],
                TInput["select"][K]
              >[]
            | ({} extends Pick<TModel["relation"], K> ? null : never)
          >
        : ErrorBase<{
            message: "Invalid input";
            model: NonNullable<TModel["relation"][K]>;
            input: TInput["select"][K];
          }>
      : ErrorBase<{
          message: "Invalid model";
          parent: TModel;
          key: K;
          children: NonNullable<TModel["relation"][K]>;
        }>
    : K extends keyof TModel["primitive"]
    ? Wrap<
        | TModel["primitive"][K]
        | ({} extends Pick<TModel["primitive"], K> ? null : never)
      >
    : never;
};
