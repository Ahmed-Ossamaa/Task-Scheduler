import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
}));
