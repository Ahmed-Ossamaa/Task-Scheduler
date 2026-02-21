import { registerAs } from '@nestjs/config';

export default registerAs('db', () => {
  return {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
    autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true',
    synchronize: process.env.NODE_ENV === 'development',
  };
});
