import { Provider } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from '../../config/cloudinary.config';

export const CLOUDINARY_TOKEN = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY_TOKEN,
  inject: [cloudinaryConfig.KEY],
  useFactory: () => {
    return cloudinary.config({
      secure: true,
    });
  },
};
