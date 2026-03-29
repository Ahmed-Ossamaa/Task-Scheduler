import { Injectable, BadRequestException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import { StorageService } from './storage.interface';
import 'multer';

@Injectable()
export class CloudinaryService implements StorageService {
  async uploadImage(
    file: Express.Multer.File,
    folder = 'general',
    customFilename?: string,
    overwrite = true,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder, public_id: customFilename, overwrite: overwrite },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(new BadRequestException('Failed to upload image'));
          }
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      if (error) {
        console.error(
          `Cloudinary deletion failed for ID: \n ${publicId}`,
          error,
        );
        throw new BadRequestException('Failed to delete image');
      }
    }
  }
}
