import { registerAs } from '@nestjs/config';

export default registerAs('oAuth', () => ({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackUrl: `${process.env.BASE_URL}/auth/google/callback`,
  },
}));
