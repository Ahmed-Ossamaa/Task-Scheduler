import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

export const AppDataSource = new DataSource({
  type: 'postgres',

  url: process.env.DATABASE_URL || undefined,

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: ['dist/features/**/entities/*.entity.js'],

  migrations: ['dist/database/migrations/*.js'],

  synchronize: false,
});
