import {
  BadRequestException,
  Injectable,
  PipeTransform,
  type ArgumentMetadata,
} from "@nestjs/common";

type SafeParseResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        issues: Array<{
          path: Array<string | number | symbol>;
          message: string;
        }>;
      };
    };

interface ZodSchemaLike<T> {
  safeParse(value: unknown): SafeParseResult<T>;
}

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchemaLike<T>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: "Validation failed.",
        issues: result.error.issues.map((issue) => ({
          path: issue.path.map(String).join("."),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }
}
