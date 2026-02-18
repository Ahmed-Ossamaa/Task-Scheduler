import * as Joi from 'joi';

/*
 * Validate the environment variables
 */
export function validateEnv<T>(
  schema: Joi.ObjectSchema<T>,
  env: NodeJS.ProcessEnv = process.env,
  context = 'ENV',
): T {
  const { error, value } = schema.validate(env, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw new Error(
      `Config validation error (${context}):\n` +
        error.details.map((d) => `- ${d.message}`).join('\n'),
    );
  }

  return value as T;
}
