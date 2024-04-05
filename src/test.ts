type OK<T> = { isError: false; value: T };
type ErrorBase<T> = { isError: true; details?: T };
type AnyError = ErrorBase<undefined>;
type Postprocess<T> = [AnyError] extends [T[keyof T]]
  ? Extract<T[keyof T], ErrorBase<any>>
  : { [K in keyof T]: T[K] extends OK<infer I> ? I : never };
type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

// below is to test code above

type StubError = ErrorBase<"stub!">;

type ThisHasNoError = {
  some: OK<"properties">;
  itWorks: OK<{ evenWith: "nested types" } | "and complex types">;
};
type ItsJustWorking = Postprocess<ThisHasNoError>;

type ThisHasError = ExpandRecursively<
  ThisHasNoError & {
    someFieldsAre: StubError;
  }
>;
type ThisIsError = Postprocess<ThisHasError>;

type ThisReferencesItself = {
  self: OK<ThisReferencesItself>;
};
type EvenRecursiveWorks = Postprocess<ThisReferencesItself>;

interface Test {
  a: number;
  b: string;
}
type Problematic<T> = {
  [K in keyof T]?: OK<Problematic<T[K]>>;
};
type Problem = Postprocess<Problematic<Test>>;
