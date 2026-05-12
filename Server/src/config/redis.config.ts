import { registerAs } from '@nestjs/config';

type BackoffType = 'fixed' | 'exponential';

export default registerAs('redis', () => {
  const url = process.env.REDIS_URL;

  const parsedUrl = url ? new URL(url) : null;

  const connectionOptions = parsedUrl
    ? {
        host: parsedUrl.hostname,
        port: Number(parsedUrl.port) || 6379,
        password: parsedUrl.password,
        ...(parsedUrl.protocol === 'rediss:' ? { tls: {} } : {}),
        family: 4,
        maxRetriesPerRequest: null,
      }
    : {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
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
