import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import type { ZodSchema } from 'zod';

type ZodDtoLike = {
  schema?: ZodSchema;
};

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const target = metadata.metatype as ZodDtoLike | undefined;

    if (!target?.schema) {
      return value;
    }

    return target.schema.parse(value);
  }
}
