import { registerAs } from '@nestjs/config';
// import * as Joi from 'joi';
// import { validateEnv } from './validators/validate-env';

// interface JwtEnv {
//   JWT_ACCESS_SECRET: string;
//   JWT_REFRESH_SECRET: string;
//   JWT_ACCESS_EXPIRES: string;
//   JWT_REFRESH_EXPIRES: string;
// }

// export default registerAs('jwt', () => {
//   const env = validateEnv<JwtEnv>(
//     Joi.object({
//       JWT_ACCESS_SECRET: Joi.string().required(),
//       JWT_REFRESH_SECRET: Joi.string().required(),
//       JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
//       JWT_REFRESH_EXPIRES: Joi.string().default('7d'),
//     }),
//     process.env,
//     'JWT',
//   );

//   return {
//     accessSecret: env.JWT_ACCESS_SECRET,
//     refreshSecret: env.JWT_REFRESH_SECRET,
//     accessExpires: env.JWT_ACCESS_EXPIRES,
//     refreshExpires: env.JWT_REFRESH_EXPIRES,
//   };
// });

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET!,
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessExpires: process.env.JWT_ACCESS_EXPIRES,
  refreshExpires: process.env.JWT_REFRESH_EXPIRES,
}));
