type OK<T> = { isError: false; value: T };
type ErrorBase<T> = { isError: true; details?: T };
type AnyError = ErrorBase<undefined>;
type Wrap<T> = [{ isError: true }] extends [T]
  ? T extends { isError: true }
    ? T
    : never
  : OK<T>;
type Postprocess<T> = [AnyError] extends [T[keyof T]]
  ? ExpandRecursively<Extract<T[keyof T], ErrorBase<any>>>
  : { [K in keyof T]: T[K] extends OK<infer I> | undefined ? I : never };
type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

type TryGetModelName<T> = T extends { name: infer I }
  ? string extends I
    ? "(no name)"
    : I
  : T extends (infer I)[]
  ? TryGetModelName<I>
  : "(no name)";
type InvalidModelError<TParent, TKey extends keyof TParent> = ErrorBase<{
  message: "Invalid Model";
  parent: TryGetModelName<TParent>;
  key: TKey;
  children: TryGetModelName<TParent[TKey]>;
}>;
type InvalidInputError<TModel, TInput> = ErrorBase<{
  message: "Invalid Input";
  model: TryGetModelName<TModel>;
  input: TInput;
}>;
type ReversePostprocess<T> = {
  [K in keyof T]: OK<T[K]>;
};

export interface Model {
  primitive: {};
  relation: {};
}

export type Input<T extends Model> = true | IncludeInput<T> | SelectInput<T>;

export type IncludeInput<T extends Model> = {
  include: Postprocess<IncludeInputInternal<T>>;
};
type IncludeInputInternal<T extends Model> = {
  readonly [K in keyof T["relation"]]?: NonNullable<
    T["relation"][K]
  > extends Model
    ? Wrap<Input<NonNullable<T["relation"][K]>>>
    : T["relation"][K] extends Model[]
    ? Wrap<Input<T["relation"][K][number]>>
    : InvalidModelError<T, K>;
};

export type SelectInput<T extends Model> = {
  select: Postprocess<SelectInputInternal<T>>;
};
type SelectInputInternal<T extends Model> = {
  readonly [K in
    | keyof T["primitive"]
    | keyof T["relation"]]?: K extends keyof T["primitive"]
    ? OK<true>
    : K extends keyof T["relation"]
    ? NonNullable<T["relation"][K]> extends Model
      ? Wrap<Input<NonNullable<T["relation"][K]>>>
      : T["relation"][K] extends Model[]
      ? Wrap<Input<T["relation"][K][number]>>
      : InvalidModelError<T, K>
    : never;
};

export type Primitive<T extends Model> = {
  [K in keyof T["primitive"]]-?:
    | NonNullable<T["primitive"][K]>
    | ({} extends Pick<T["primitive"], K> ? null : never);
};

export type Result<
  TModel extends Model,
  TInput extends Input<TModel>
> = TInput extends true
  ? Primitive<TModel>
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
> = ReversePostprocess<Primitive<TModel>> & {
  [K in keyof TInput["include"]]-?: K extends keyof TModel["relation"]
    ? NonNullable<TModel["relation"][K]> extends Model
      ? TInput["include"][K] extends Input<NonNullable<TModel["relation"][K]>>
        ? Wrap<
            | Result<NonNullable<TModel["relation"][K]>, TInput["include"][K]>
            | ({} extends Pick<TModel["relation"], K> ? null : never)
          >
        : InvalidInputError<TModel["relation"][K], TInput["include"][K]>
      : TModel["relation"][K] extends Model[]
      ? TInput["include"][K] extends Input<TModel["relation"][K][number]>
        ? Wrap<
            | Result<TModel["relation"][K][number], TInput["include"][K]>[]
            | ({} extends Pick<TModel["relation"], K> ? null : never)
          >
        : InvalidInputError<TModel["relation"][K], TInput["include"][K]>
      : InvalidModelError<TModel, K>
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
        : InvalidInputError<TModel["relation"][K], TInput["select"][K]>
      : TModel["relation"][K] extends Model[]
      ? TInput["select"][K] extends Input<TModel["relation"][K][number]>
        ? Wrap<
            | Result<TModel["relation"][K][number], TInput["select"][K]>[]
            | ({} extends Pick<TModel["relation"], K> ? null : never)
          >
        : InvalidInputError<TModel["relation"][K], TInput["select"][K]>
      : InvalidModelError<TModel, K>
    : K extends keyof TModel["primitive"]
    ? Wrap<
        | NonNullable<TModel["primitive"][K]>
        | ({} extends Pick<TModel["primitive"], K> ? null : never)
      >
    : never;
};
