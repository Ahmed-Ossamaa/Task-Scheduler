import { registerAs } from '@nestjs/config';
// import Joi from 'joi';
// import { validateEnv } from './validators/validate-env';

// export interface DbEnv {
//   DATABASE_URL?: string;
//   DB_HOST?: string;
//   DB_PORT?: number;
//   DB_USER?: string;
//   DB_PASS?: string;
//   DB_NAME?: string;
//   DB_AUTO_LOAD_ENTITIES: boolean;
//   DB_SYNCHRONIZE: boolean;
// }


// const dbSchema = Joi.object({
//   DATABASE_URL: Joi.string().optional(),
//   DB_HOST: Joi.string().when('DATABASE_URL', {
//     is: Joi.exist(),
//     then: Joi.optional(),
//     otherwise: Joi.required(),
//   }),
//   DB_PORT: Joi.number().default(5432),
//   DB_USER: Joi.string().optional(),
//   DB_PASS: Joi.string().optional(),
//   DB_NAME: Joi.string().optional(),
//   DB_AUTO_LOAD_ENTITIES: Joi.boolean().default(true),
// });

// export default registerAs('db', () => {
//   const env = validateEnv<DbEnv>(dbSchema, process.env, 'DB');

//   return {
//     url: env.DATABASE_URL,
//     host: env.DB_HOST,
//     port: env.DB_PORT,
//     user: env.DB_USER,
//     pass: env.DB_PASS,
//     name: env.DB_NAME,
//     autoLoadEntities: env.DB_AUTO_LOAD_ENTITIES,
//     synchronize: process.env.NODE_ENV === 'development',
//   };
// });

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