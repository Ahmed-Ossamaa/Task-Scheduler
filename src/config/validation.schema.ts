import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // APP
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(5000),

  // JWT
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES: Joi.string().default('1d'),

  // DATABASE
  DATABASE_URL: Joi.string().optional(),
  DB_HOST: Joi.string().when('DATABASE_URL', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().optional(),
  DB_PASS: Joi.string().optional(),
  DB_NAME: Joi.string().optional(),
  DB_AUTO_LOAD_ENTITIES: Joi.boolean().default(true),

  // REDIS
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  REDIS_ATTEMPTS: Joi.number().default(3),
  REDIS_BACKOFF_TYPE: Joi.string()
    .valid('fixed', 'exponential')
    .default('exponential'),
  REDIS_BACKOFF_DELAY: Joi.number().default(3000),
  REDIS_REMOVE_ON_COMPLETE: Joi.boolean().default(true),
  REDIS_REMOVE_ON_FAIL: Joi.boolean().default(false),
});
