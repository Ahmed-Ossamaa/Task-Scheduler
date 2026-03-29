import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

/**
 * @description
 * Validation pipe for image files.
 *
 * Max size: 5MB.
 *
 * Allowed file types: png, jpeg, jpg, webp.
 */
export const ImageValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
  ],
});
