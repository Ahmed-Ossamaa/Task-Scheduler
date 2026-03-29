import { Provider } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from '../../config/cloudinary.config';
import { ConfigType } from '@nestjs/config';

export const CLOUDINARY_TOKEN = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY_TOKEN,
  inject: [cloudinaryConfig.KEY],
  useFactory: (config: ConfigType<typeof cloudinaryConfig>) => {
    return cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });
  },
};
