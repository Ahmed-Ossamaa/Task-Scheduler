export abstract class StorageService {
  abstract uploadImage(
    file: Express.Multer.File,
    folder?: string,
    customFilename?: string,
    overwrite?: boolean,
  ): Promise<string>;
  abstract deleteImage(publicId: string): Promise<void>;
}
