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
  /**
   * Uploads an image to Cloudinary.
   * @param file The image to upload.
   * @param folder The folder to upload the image to. Defaults to 'general'.
   * @param customFilename The custom filename to use for the image. Defaults to null.
   * @param overwrite Whether to overwrite an existing image with the same filename. Defaults to true.
   * @returns A promise with the URL of the uploaded image.
   */
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
      console.error(`Cloudinary deletion failed for ID: \n ${publicId}`, error);
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
    try {
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
    } catch (error) {
      console.warn('Error extracting public ID from URL:', error);
      return null;
    }
  }
}
