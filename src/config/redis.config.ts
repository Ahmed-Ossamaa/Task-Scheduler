import { registerAs } from '@nestjs/config';

type BackoffType = 'fixed' | 'exponential';

export default registerAs('redis', () => ({
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.NODE_ENV === 'production' ? {} : undefined,
  },
  defaultJobOptions: {
    attempts: Number(process.env.REDIS_ATTEMPTS),
    backoff: {
      type: process.env.REDIS_BACKOFF_TYPE as BackoffType,
      delay: Number(process.env.REDIS_BACKOFF_DELAY),
    },
    removeOnComplete: process.env.REDIS_REMOVE_ON_COMPLETE === 'true',
    removeOnFail: process.env.REDIS_REMOVE_ON_FAIL === 'true',
  },
}));
