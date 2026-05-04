import { registerAs } from '@nestjs/config';

type BackoffType = 'fixed' | 'exponential';

export default registerAs('redis', () => {
  const url = process.env.REDIS_URL;

  const connectionOptions = url
    ? {
        host: new URL(url).hostname,
        port: Number(new URL(url).port) || 6379,
        password: new URL(url).password,
        tls: { rejectUnauthorized: false },
        family: 4,
      }
    : {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      };

  return {
    connection: connectionOptions,
    defaultJobOptions: {
      attempts: Number(process.env.REDIS_ATTEMPTS) || 3,
      backoff: {
        type: (process.env.REDIS_BACKOFF_TYPE as BackoffType) || 'exponential',
        delay: Number(process.env.REDIS_BACKOFF_DELAY) || 3000,
      },
      removeOnComplete: process.env.REDIS_REMOVE_ON_COMPLETE === 'true',
      removeOnFail: process.env.REDIS_REMOVE_ON_FAIL === 'true',
    },
  };
});
