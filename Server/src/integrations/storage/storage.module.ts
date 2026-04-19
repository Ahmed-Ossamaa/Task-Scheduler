import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { StorageService } from './storage.interface';

@Module({
  providers: [
    CloudinaryProvider,
    {
      provide: StorageService,
      useClass: CloudinaryService,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
