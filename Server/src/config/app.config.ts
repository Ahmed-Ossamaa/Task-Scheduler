import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dataRetentionCron: process.env.DATA_RETENTION_CRON || '0 3 * * *',
}));
