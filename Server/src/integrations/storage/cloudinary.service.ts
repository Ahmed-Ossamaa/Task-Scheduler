import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import { StorageService } from './storage.interface';
import 'multer';

export type ImageUploadType = 'avatar' | 'standard' | 'logo';

@Injectable()
export class CloudinaryService implements StorageService {
  private readonly logger = new Logger(CloudinaryService.name);
  /**
   * Uploads an image to Cloudinary.
   * @param file The image to upload.
   * @param folder The folder to upload the image to. Defaults to 'general'.
   * @param customFilename The custom filename to use for the image. Defaults to null.
   * @param overwrite Whether to overwrite an existing image with the same filename. Defaults to true.
   * @param imageType The type of image to upload (avatar, standard, logo). Defaults to 'standard'.
   * @returns A promise with the URL of the uploaded image.
   */
  async uploadImage(
    file: Express.Multer.File,
    folder = 'general',
    customFilename?: string,
    overwrite = true,
    imageType: ImageUploadType = 'standard',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let transformations: any[] = [];
      const isSvg =
        file.mimetype === 'image/svg+xml' || file.originalname.endsWith('.svg');

      if (isSvg) {
        transformations = [];
      } else if (imageType === 'avatar') {
        transformations = [
          { width: 250, height: 250, crop: 'fill', gravity: 'face' },
          { fetch_format: 'auto', quality: 'auto' },
        ];
      } else if (imageType === 'standard') {
        transformations = [
          { width: 1920, crop: 'limit' },
          { fetch_format: 'auto', quality: 'auto' },
        ];
      } else {
        transformations = [{ fetch_format: 'auto', quality: 'auto:best' }];
      }
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: customFilename,
          overwrite: overwrite,
          transformation: transformations,
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) {
            return reject(
              new BadRequestException(
                `Cloudinary upload failed: ${error.message}`,
              ),
            );
          }
          if (!result) {
            return reject(new BadRequestException('Upload failed: no result'));
          }

          resolve(result.secure_url);
        },
      );

      const stream = Readable.from(file.buffer);

      stream.on('error', (err) => {
        reject(new BadRequestException(`Stream error: ${err.message}`));
      });

      stream.pipe(upload);
    });
  }

  /**
   * Deletes an image from Cloudinary by its public ID.
   *
   * Will throw a BadRequestException if deletion fails.
   * @param publicId The public ID of the image to delete.
   * @returns A promise that resolves when the image is deleted successfully.
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.logger.error(
        `Cloudinary deletion failed for ID: ${publicId}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new BadRequestException('Failed to delete image');
    }
  }

  /**
   * Extracts the public ID from a Cloudinary URL.
   *
   * The public ID is the part of the URL after '/upload/' and before the version number.
   * @returns The (public ID) as a string, or (null) if an error occurs.
   */
  extractPublicIdFromUrl(url: string): string | null {
    if (!url || typeof url !== 'string') return null;

    //Split the URL at '/upload/'
    //upload/ then =>>  version/folder/filename
    const urlParts = url.split('/upload/');
    if (urlParts.length < 2) return null;

    let pathString = urlParts[1];

    //Remove version ('v1612345678/')
    pathString = pathString.replace(/^v\d+\//, '');

    //Remove the file extension (.jpg, .png) whatevrr after the last dot
    const lastDotIndex = pathString.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return pathString.substring(0, lastDotIndex);
    }

    //if no file extension (fallback)
    return pathString;
  }
}
