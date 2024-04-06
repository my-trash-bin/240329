import { Input, Model, Result } from "../../src/main";

export function Fake<TModel extends Model>() {
  return function GetResult<TInput extends Input<TModel>>(
    input: TInput
  ): Result<TModel, TInput> {
    throw new Error("Not implemented");
  };
}
