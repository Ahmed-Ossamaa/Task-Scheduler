import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { StorageService } from './storage.interface';

@Module({
  imports: [ConfigModule],
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
