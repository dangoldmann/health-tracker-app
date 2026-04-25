import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodTypeAny } from "zod";

export class ZodValidationPipe<
  TSchema extends ZodTypeAny,
> implements PipeTransform<unknown, ReturnType<TSchema["parse"]>> {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }

    return result.data;
  }
}
