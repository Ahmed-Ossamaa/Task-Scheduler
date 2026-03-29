import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

/**
 * A decorator that enables image upload for a controller method.
 *
 * (Multer Interceptor & Swagger UI)
 * @param {string} [fieldName='file'] The name of the form field that contains the image.
 * @returns {MethodDecorator}
 */
export function ApiImageUpload(fieldName: string = 'file'): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
